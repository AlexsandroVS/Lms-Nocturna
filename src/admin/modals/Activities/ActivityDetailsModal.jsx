/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTimes,
  faFile,
  faDownload,
  faSpinner,
  faArrowRight,
  faFilePdf,
  faFileVideo,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const ActivityDetailsModal = ({ activity, onClose }) => {
  const { api, currentUser } = useAuth();
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState({
    upload: false,
  });
  const [uploadError, setUploadError] = useState(null);
  const [adminFile, setAdminFile] = useState(null); // Archivo del admin (guía)

  useEffect(() => {
    const fetchAdminFile = async () => {
      try {
        const response = await api.get(
          `/activities/${activity.ActivityID}/files`
        );
        // Filtrar el archivo del admin (guía)
        const adminFile = response.data.find(
          (file) => file.ActivityID === activity.ActivityID
        );
        setAdminFile(adminFile || null);
      } catch (error) {
        console.error("Error al obtener el archivo del admin:", error);
      }
    };

    fetchAdminFile();
  }, [activity.ActivityID, api]);

  const handleFileUpload = async () => {
    if (!file) {
      setUploadError("Por favor selecciona un archivo");
      return;
    }

    // Validar el tipo de archivo
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Tipo de archivo no permitido. Solo se permiten PDF y Word."
      );
      return;
    }

    setLoading({ upload: true });
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
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setUploadError("Error al subir el archivo. Intenta nuevamente.");
    } finally {
      setLoading({ upload: false });
      setFile(null);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return faFilePdf;
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return faFileWord;
    } else if (fileType.startsWith("video/")) {
      return faFileVideo; // Puedes usar un icono de video si lo tienes
    } else {
      return faFile;
    }
  };

  const FileCard = ({ file }) => {
    const [loading, setLoading] = useState(false);
    const { api } = useAuth();
  
    // Verificar si el archivo es un video
    const isVideo = file.FileType.startsWith("video/");
  
    // Obtener la URL completa del archivo
    const fileUrl = `${api.defaults.baseURL}/files/${file.FileID}`;
  
    const handleDownload = async () => {
      try {
        setLoading(true);
  
        // Realiza la solicitud al servidor para descargar el archivo usando `api`
        const response = await api.get(`/files/${file.FileID}`, {
          responseType: "blob", // Indica que la respuesta es un archivo binario
        });
  
        // Crea un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = file.FileName; // Usa el nombre original del archivo
        document.body.appendChild(link);
        link.click();
  
        // Limpia el enlace temporal
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("Hubo un error al descargar el archivo. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={getFileIcon(file.FileType)}
            className={`text-xl ${
              file.FileType === "application/pdf"
                ? "text-red-500"
                : file.FileType.includes("word")
                ? "text-blue-500"
                : "text-gray-500"
            }`}
          />
          <span className="text-gray-700 truncate max-w-[200px]">
            {file.FileName}
          </span>
        </div>
  
        {isVideo ? (
          // Mostrar reproductor de video si el archivo es un video
          <div className="w-full">
            <video
              controls
              className="w-full h-auto max-h-96 rounded-lg shadow-md"
            >
              <source src={fileUrl} type={file.FileType} />
              Tu navegador no soporta la reproducción de videos.
            </video>
          </div>
        ) : (
          // Mostrar botón de descarga si no es un video
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              <FontAwesomeIcon icon={faDownload} />
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-5">
          {activity.Title}
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Descripción
            </label>
            <p className="text-gray-700 mt-1 whitespace-pre-wrap">
              {activity.Content || "Sin descripción"}
            </p>
          </div>
          

          {adminFile ? (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Guía de la actividad
              </label>
              <FileCard file={adminFile} />
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay una guía disponible para esta actividad.
            </p>
          )}
        </div>

        {currentUser?.role === "admin" && (
          <div className="border-t pt-5">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate(`/files/${activity.ActivityID}`)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Ver detalle
                <FontAwesomeIcon icon={faArrowRight} size="xs" />
              </button>
            </div>
          </div>
        )}

        {currentUser?.role !== "admin" && (
          <div className="border-t pt-5">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Subir entrega
              </h3>

              <div className="flex flex-col gap-3">
                <label
                  className="w-full flex flex-col items-center justify-center 
                  border-2 border-dashed border-gray-300 rounded-lg p-6 
                  hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <FontAwesomeIcon
                    icon={file ? faFile : faUpload}
                    className={`text-xl mb-2 ${
                      file ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <p className="text-sm text-center">
                    {file ? file.name : "Haz click o arrastra tu archivo"}
                  </p>
                </label>

                {uploadError && (
                  <p className="text-red-500 text-sm">{uploadError}</p>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={loading.upload || !file}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg
                    hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors flex items-center justify-center gap-2"
                >
                  {loading.upload ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} />
                      Subir archivo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
