/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFile,
  faArrowRight,
  faDownload,
  faSpinner,
  faClock,
  faCheckCircle,
  faInfoCircle,
  faExclamationTriangle,
  faExclamationCircle,
  faCloudUpload,
  faPaperPlane,
  faClipboardList,
  faFilePdf,
  faFileVideo,
  faFileWord,
  
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const ActivityDetailsPanel = ({ activity, courseId, moduleId }) => {
  const { api, currentUser } = useAuth();
  const navigate = useNavigate();
  const realModuleId = moduleId || activity?.ModuleID;
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") return faFilePdf;
    if (fileType.includes("word")) return faFileWord;
    if (fileType.startsWith("video/")) return faFileVideo;
    return faFile;
  };
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState({ upload: false, general: false });
  const [uploadError, setUploadError] = useState(null);
  const [adminFiles, setAdminFiles] = useState([]);
  const [studentFiles, setStudentFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(true);

  // Cargar archivos
  const fetchFiles = async () => {
    try {
      const [usersResp, filesResp] = await Promise.all([
        api.get("/users"),
        api.get(`/activities/${activity.ActivityID}/files`),
      ]);

      const adminUserIds = usersResp.data
        .filter((user) => user.Role === "admin")
        .map((user) => user.UserID);

      const adminFiles = filesResp.data.filter((file) =>
        adminUserIds.includes(file.UserID)
      );
      const studentFiles = filesResp.data.filter(
        (file) => !adminUserIds.includes(file.UserID)
      );

      setAdminFiles(adminFiles);
      setStudentFiles(studentFiles);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
    }
  };

  useEffect(() => {
    if (activity) {
      fetchFiles();
    }
  }, [activity?.ActivityID, api]);

  // Subir archivo
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
      fetchFiles();
    } catch (error) {
      setUploadError("Error al subir el archivo. Inténtalo nuevamente.");
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
      setFile(null);
    }
  };
  const hasReachedLimit = useMemo(() => {
    const max = activity?.MaxAttempts || 1;
    const currentUserFiles = studentFiles.filter(file => file.UserID === currentUser?.userId);
    return currentUserFiles.length >= max;
  }, [studentFiles, activity?.MaxAttempts, currentUser?.userId]);
  

  const FileCard = ({ file, showDetails = true }) => {
    const [cardLoading, setCardLoading] = useState(false);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(600);
    const [numPages, setNumPages] = useState(null);
    const [showFiles, setShowFiles] = useState(true);
    const { api } = useAuth();

    const fileUrl = `http://localhost:5000/${file.Files.replace(/\\/g, "/")}`;
    const fileName = file.Files || "";
    const extension = fileName.split(".").pop().toLowerCase();

    const isVideo = file.FileType.startsWith("video/");
    const isPDF = extension === "pdf";
    const isWord = extension === "docx" || extension === "doc";

    useEffect(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleDownload = async () => {
      try {
        setCardLoading(true);
        const response = await api.get(`/files/${file.FileID}`, {
          responseType: "blob",
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // 🛠️ Cambiar extensión si es PDF
        let downloadName = file.FileName;
        if (file.FileType === "application/pdf") {
          downloadName = file.FileName.replace(/\.[^/.]+$/, ".pdf"); // forzar extensión .pdf
        }

        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("Hubo un error al descargar el archivo.");
      } finally {
        setCardLoading(false);
      }
    };

    const getFileIcon = (fileType) => {
      if (fileType === "application/pdf") return faFilePdf;
      if (fileType.includes("word")) return faFileWord;
      if (fileType.startsWith("video/")) return faFileVideo;
      return faFile;
    };

    const getFileColorClass = (fileType) => {
      if (fileType === "application/pdf") return "bg-red-500";
      if (fileType.includes("word")) return "bg-blue-500";
      if (fileType.startsWith("video/")) return "bg-purple-500";
      return "bg-gray-500";
    };

    const WordViewer = ({ fileUrl }) => {
      const [htmlContent, setHtmlContent] = useState("Cargando documento...");
      const [error, setError] = useState(null);

      useEffect(() => {
        const loadWord = async () => {
          try {
            const response = await fetch(fileUrl);
            const arrayBuffer = await response.arrayBuffer();
            const { value } = await mammoth.convertToHtml({ arrayBuffer });
            setHtmlContent(value);
          } catch (err) {
            console.error("Error al cargar Word:", err);
            setError("No se pudo cargar el archivo Word.");
          }
        };

        loadWord();
      }, [fileUrl]);

      if (error) {
        return <p className="text-red-500">{error}</p>;
      }

      return (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    };

    return (
      <div
        ref={containerRef}
        className="group relative flex flex-col gap-4 p-4 bg-white rounded-xl  transition-all w-full"
      >
        {/* Header */}
        {(!isVideo || showDetails) && (
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
              </div>
            </div>

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
        )}

        {/* Content */}
        {isVideo && (
          <div className="w-full relative pt-[56.25%]">
            <video
              controls
              className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
            >
              <source src={fileUrl} type={file.FileType} />
            </video>
          </div>
        )}

        {isPDF && (
          <div className="w-full flex flex-col items-center">
            <Document
              file={fileUrl}
              onLoadError={(error) =>
                console.error("Error cargando PDF:", error)
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading="Cargando PDF..."
              noData="No se encontró PDF."
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={containerWidth * 0.95}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className="mb-4"
                />
              ))}
            </Document>
          </div>
        )}

        {isWord && (
          <div className="w-full flex justify-center">
            <div className="w-full bg-gray-100 p-6 rounded-lg overflow-auto max-h-[600px]">
              <WordViewer fileUrl={fileUrl} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const getActivityStatus = () => {
    if (!activity?.Deadline || typeof activity.Deadline !== "string")
      return null;
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

  if (!activity) {
    return (
      <div className="p-4 bg-white rounded shadow text-gray-500">
        Selecciona una actividad para ver sus detalles
      </div>
    );
  }

  const videoFiles = adminFiles.filter((f) => f.FileType.startsWith("video/"));
  const mainVideo = videoFiles.length > 0 ? videoFiles[0] : null;
  const otherFiles = adminFiles.filter((f) => f !== mainVideo);

  return (
    <div className="p-4 bg-white rounded-2xl w-full h-auto flex flex-col">
      {/* Encabezado */}
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

      {/* Video solo si existe */}
      {mainVideo && (
        <div className="mb-6">
          <FileCard file={mainVideo} showDetails={false} />
        </div>
      )}

      {/* Descripción */}
      <div className="mb-6 bg-gray-50 p-4 rounded-xl">
        <label className="block text-sm font-semibold text-gray-500 mb-2">
          Descripción de la actividad
        </label>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {activity.Content || "Esta actividad no tiene descripción."}
        </p>
      </div>

      {/* Material de apoyo */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Material de apoyo
          </h3>
          <button
            onClick={() => setShowFiles((prev) => !prev)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showFiles ? "Ocultar archivos" : "Mostrar archivos"}
          </button>
        </div>

        {showFiles && (
          <>
            {otherFiles.length > 0 ? (
              <div className="flex flex-col gap-6">
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
          </>
        )}
      </div>
      {/* Subida de Archivos */}
      {["student", "user"].includes(currentUser?.role) && (
       <div className="mt-8 bg-white p-6 rounded-2xl ">
       <div className="flex items-center gap-3 mb-6">
         <div className="p-2 bg-blue-100 rounded-lg">
           <FontAwesomeIcon icon={faUpload} className="text-blue-600 text-lg" />
         </div>
         <h3 className="text-2xl font-semibold text-gray-900">Entregar tarea</h3>
       </div>
     
       <div className="flex items-center gap-3 mb-6 bg-blue-50/50 p-4 rounded-xl">
         <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400" />
         <p className="text-sm text-gray-600 mb-4">
  Intentos usados:{" "}
  <strong>
    {
      studentFiles.filter((file) => file.UserID === currentUser?.userId).length
    }
  </strong>{" "}
  / <strong>{activity?.MaxAttempts || 1}</strong>
</p>

       </div>
     
       {hasReachedLimit ? (
         <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3 mb-4">
           <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 mt-1" />
           <div>
             <p className="text-red-600 font-medium">Límite alcanzado</p>
             <p className="text-red-500 text-sm">
               Ya has utilizado todos los intentos permitidos para esta actividad.
             </p>
           </div>
         </div>
       ) : (
         <div className="space-y-4">
           <div className="relative group">
             <input
               type="file"
               onChange={(e) => setFile(e.target.files[0])}
               accept=".pdf,.doc,.docx,.pptx,.mp4,.webm"
               className="w-full opacity-0 absolute inset-0 cursor-pointer"
               id="fileInput"
             />
             <label
               htmlFor="fileInput"
               className="block w-full p-8 border-2 border-dashed border-gray-200 hover:border-blue-300 rounded-xl transition-all group-hover:bg-blue-50/20 cursor-pointer"
             >
               <div className="text-center space-y-2">
                 <FontAwesomeIcon icon={faCloudUpload} className="text-3xl text-blue-400 mb-2" />
                 <p className="text-gray-600 font-medium">
                   {file ? file.name : "Arrastra tu archivo aquí o haz clic para seleccionar"}
                 </p>
                 <p className="text-sm text-gray-400">Formatos permitidos: PDF, Word, MP4, WebM</p>
               </div>
             </label>
           </div>
     
           {uploadError && (
             <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-600 text-sm">
               <FontAwesomeIcon icon={faExclamationCircle} />
               <span>{uploadError}</span>
             </div>
           )}
     
           <button
             onClick={handleFileUpload}
             disabled={loading.upload}
             className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${
               loading.upload
                 ? "bg-gray-200 cursor-wait text-gray-500"
                 : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-200"
             }`}
           >
             {loading.upload ? (
               <>
                 <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                 Subiendo...
               </>
             ) : (
               <>
                 <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                 Enviar entrega
               </>
             )}
           </button>
         </div>
       )}
     
       {studentFiles.length > 0 && (
         <div className="mt-8 space-y-4">
           <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
             <FontAwesomeIcon icon={faClipboardList} className="text-gray-400" />
             Historial de entregas
           </h4>
     
           {studentFiles.map((file) => (
             <div
               key={file.FileID}
               className="bg-white p-4 rounded-xl shadow-xs border-l-4 border-blue-200 hover:border-blue-300 transition-all"
             >
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <FontAwesomeIcon
                       icon={getFileIcon(file.FileType)}
                       className="text-blue-400 text-lg"
                     />
                     <span className="font-medium text-gray-900">{file.FileName}</span>
                   </div>
                   <span className="text-sm text-gray-500">
                     {new Date(file.UploadedAt).toLocaleDateString()}
                   </span>
                 </div>
     
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-medium text-gray-400">Calificación</label>
                     <div className="text-lg font-semibold text-blue-600">
                       {file.Score != null ? (
                         <>
                           {file.Score}/20
                           <span className="ml-2 text-sm text-green-500">
                             ({((file.Score / 20) * 100).toFixed(1)}%)
                           </span>
                         </>
                       ) : (
                         <span className="text-gray-400">Pendiente</span>
                       )}
                     </div>
                   </div>
     
                   <div>
                     <label className="text-xs font-medium text-gray-400">Retroalimentación</label>
                     <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm whitespace-pre-line">
                       {file.Feedback?.trim() || (
                         <span className="text-gray-400">Sin comentarios</span>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           ))}
         </div>
       )}
     </div>
      )}
    </div>
  );
};

export default ActivityDetailsPanel;
