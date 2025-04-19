/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFile,
  faArrowRight,
  faDownload,
  faSpinner,
  faClock,
  faCheckCircle,
  faFilePdf,
  faFileVideo,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const ActivityDetailsPanel = ({ activity, courseId, moduleId }) => {
  const { api, currentUser } = useAuth();
  const navigate = useNavigate();
  const realModuleId = moduleId || activity?.ModuleID;


  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState({ upload: false, general: false });
  const [uploadError, setUploadError] = useState(null);

  // Archivos subidos por administradores
  const [adminFiles, setAdminFiles] = useState([]);

  // --- 1. Cargar archivos de administradores ---

  const fetchAdminFiles = async () => {
    try {
      const usersResp = await api.get("/users");
      const adminUserIds = usersResp.data
        .filter((user) => user.Role === "admin")
        .map((user) => user.UserID);

      const filesResp = await api.get(
        `/activities/${activity.ActivityID}/files`
      );
      const filteredFiles = filesResp.data.filter((file) =>
        adminUserIds.includes(file.UserID)
      );
      setAdminFiles(filteredFiles);
    } catch (error) {
      console.error("Error al obtener los archivos de administradores:", error);
    }
  };

  useEffect(() => {
    if (activity) {
      fetchAdminFiles();
    }
  }, [activity.ActivityID, api]);

  // --- 2. Subir archivo/entrega (solo estudiantes) ---
  const handleFileUpload = async () => {
    if (!file) {
      setUploadError("Por favor selecciona un archivo");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Tipo de archivo no permitido. Solo se permiten PDF, Word, MP4, WebM."
      );
      return;
    }

    setLoading((prev) => ({ ...prev, upload: true }));
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);  

    try {
      await api.post(
        `/courses/${courseId}/modules/${moduleId}/activities/${activity.ActivityID}/files`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );      
      alert("Archivo subido con éxito");
      fetchAdminFiles();
    } catch (error) {
      setUploadError("Error al subir el archivo. Inténtalo nuevamente.");
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
      setFile(null);
    }
  };
  console.log("📥 En modal:", courseId, moduleId);


  useEffect(() => {
    console.log("courseId:", courseId);
    console.log("moduleId:", moduleId);
    console.log("activity:", activity);
  }, [courseId, moduleId, activity]);
  


  // --- 3. FileCard: renderiza CUALQUIER tipo de archivo (video, PDF, Word, etc.) ---
  const FileCard = ({ file }) => {
    const [cardLoading, setCardLoading] = useState(false);
    const { api } = useAuth();
    const fileUrl = `http://localhost:5000/${file.Files.replace(/\\/g, "/")}`;
    const isVideo = file.FileType.startsWith("video/");

    // Descargar archivo
    const handleDownload = async () => {
      try {
        setCardLoading(true);
        const response = await api.get(`/files/${file.FileID}`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = file.FileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("Hubo un error al descargar el archivo. Inténtalo de nuevo.");
      } finally {
        setCardLoading(false);
      }
    };

    // Helpers de iconos y colores
    const getFileIcon = (fileType) => {
      if (fileType === "application/pdf") return faFilePdf;
      if (
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        return faFileWord;
      if (fileType.startsWith("video/")) return faFileVideo;
      return faFile;
    };

    const getFileColorClass = (fileType) => {
      if (fileType === "application/pdf") return "bg-red-500";
      if (fileType.includes("word")) return "bg-blue-500";
      if (fileType.startsWith("video/")) return "bg-purple-500";
      return "bg-gray-500";
    };

    const getFileTypeLabel = (fileType) => {
      const typeMap = {
        "application/pdf": "PDF Document",
        "application/msword": "Word Document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "Word Document",
        "video/mp4": "MP4 Video",
        "video/webm": "WebM Video",
      };
      return typeMap[fileType] || "File";
    };

    return (
      <div className="group relative flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all  border-gray-100 hover:border-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-3 rounded-lg ${getFileColorClass(file.FileType)}`}
            >
              <FontAwesomeIcon
                icon={getFileIcon(file.FileType)}
                className="text-white text-lg"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {file.FileName}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {getFileTypeLabel(file.FileType)}
              </p>
            </div>
          </div>

          {/* Si NO es video, muestra botón de descarga inmediata */}
          {!isVideo && (
            <button
              onClick={handleDownload}
              disabled={cardLoading}
              className="ml-2 px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              {cardLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
              ) : (
                <FontAwesomeIcon icon={faDownload} className="text-lg" />
              )}
            </button>
          )}
        </div>

        {/* Si ES un video, mostramos reproductor */}
        {isVideo && (
          <div className="w-full relative pt-[56.25%]">
            <video
              controls
              className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
            >
              <source src={fileUrl} type={file.FileType} />
              Tu navegador no soporta la reproducción de videos.
            </video>
          </div>
        )}
      </div>
    );
  };

  // --- 4. Estado de la actividad (vencido/en curso) ---
  const getActivityStatus = () => {
    if (!activity?.Deadline || typeof activity.Deadline !== "string") return null;

    try {
      const [datePart] = activity.Deadline.split("T");
      const [year, month, day] = datePart.split("-");
      const now = new Date();
      const currentDate = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      );
      const deadlineDate = Date.UTC(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10)
      );
      return currentDate > deadlineDate ? "Vencido" : "En curso";
    } catch (error) {
      console.error("Error al procesar la fecha límite:", error);
      return null;
    }
  };
  const status = getActivityStatus();

  // Si no hay actividad seleccionada
  if (!activity) {
    return (
      <div className="p-4 bg-white rounded shadow text-gray-500">
        Selecciona una actividad para ver sus detalles
      </div>
    );
  }

  // --- 5. Determinamos qué archivo video se mostrará arriba ---
  const videoFiles = adminFiles.filter((f) => f.FileType.startsWith("video/"));
  const mainVideo = videoFiles.length > 0 ? videoFiles[0] : null;

  // --- 6. Excluimos el video principal de la parte de abajo ---
  const otherFiles = adminFiles.filter((f) => f !== mainVideo);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-inner w-full h-auto flex flex-col">
      {/* --- Encabezado de la actividad --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{activity.Title}</h2>
        {status && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              status === "Vencido"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <FontAwesomeIcon
              icon={status === "Vencido" ? faClock : faCheckCircle}
              className="text-sm"
            />
            <span className="text-sm font-medium">{status}</span>
          </div>
        )}
      </div>


      

      {/* --- Sección de video principal (arriba) --- */}
      <div className="mb-6">
        {mainVideo ? (
          <FileCard file={mainVideo} />
        ) : (
          <div className="flex items-center justify-center w-full h-64 bg-gray-200 rounded-lg">
            <p className="text-gray-500 text-sm">No hay video para esta actividad</p>
          </div>
        )}
      </div>



      {/* --- Descripción de la actividad --- */}
      <div className="mb-6 bg-gray-50 p-4 rounded-xl">
        <label className="block text-sm font-semibold text-gray-500 mb-2">
          Descripción de la actividad
        </label>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {activity.Content || "Esta actividad no tiene descripción."}
        </p>
      </div>

      {/* --- Material de apoyo (excluyendo el video principal) --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Material de apoyo
          </h3>
          {currentUser?.role === "admin" && (
            <button
              onClick={() => navigate(`/files/${activity.ActivityID}`)}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm"
            >
              Gestionar archivos
              <FontAwesomeIcon icon={faArrowRight} size="xs" />
            </button>
          )}
        </div>

        {otherFiles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {otherFiles.map((file) => (
              <FileCard key={file.FileID} file={file} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <FontAwesomeIcon icon={faFile} size="2x" />
            </div>
            <p className="text-gray-500 text-sm">
              No hay material disponible para esta actividad
            </p>
          </div>
        )}
      </div>

      {/* --- Subir entrega (solo estudiantes, no admin) --- */}
      {currentUser?.role !== "admin" && (
        <div className="border-t pt-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Subir entrega
            </h3>

            <div className="flex flex-col gap-3">
              <label className="group relative cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.doc,.docx,video/mp4,video/webm"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 transition-all group-hover:border-blue-500 group-hover:bg-blue-50">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center transition-colors group-hover:bg-blue-200">
                      <FontAwesomeIcon
                        icon={file ? faFile : faUpload}
                        className={`text-xl ${
                          file ? "text-blue-600" : "text-gray-400"
                        } group-hover:text-blue-600`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        {file ? file.name : "Seleccionar archivo"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Formatos permitidos: PDF, Word, MP4, WebM
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              {uploadError && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-red-600 text-sm">{uploadError}</p>
                </div>
              )}

              <button
                onClick={handleFileUpload}
                disabled={loading.upload || !file}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
              >
                {loading.upload ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} />
                    Subir entrega
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetailsPanel;
