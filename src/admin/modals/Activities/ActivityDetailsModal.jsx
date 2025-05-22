/* eslint-disable react-hooks/exhaustive-deps */
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
  const userId = currentUser?.id || currentUser?.UserID || currentUser?.userId;

  const navigate = useNavigate();
  const realModuleId = moduleId || activity?.ModuleID;
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") return faFilePdf;
    if (fileType.includes("word")) return faFileWord;
    if (fileType.startsWith("video/")) return faFileVideo;
    return faFile;
  };
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState({ upload: false, general: false });
  const [uploadError, setUploadError] = useState(null);
  const [adminFiles, setAdminFiles] = useState([]);
  const [studentFiles, setStudentFiles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showFiles, setShowFiles] = useState(true);

  // Cargar archivos
  const fetchFiles = async () => {
    try {
      const [usersResp, filesResp, submissionsResp] = await Promise.all([
        api.get("/users"),
        api.get(`/activities/${activity.ActivityID}/files`),
        api.get(`/activities/${activity.ActivityID}/submissions/all`),
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
      setSubmissions(submissionsResp.data);

    } catch (error) {
      console.error("❌ Error al obtener archivos o entregas:", error);
    }
  };
  const hasDeadlinePassed = () => {
  if (!activity?.Deadline) return false;

  const deadline = new Date(activity.Deadline);
  deadline.setHours(23, 59, 59, 999);

  return new Date() > deadline;
};


  useEffect(() => {
    if (activity && userId) {
      fetchFiles();
    }
  }, [activity?.ActivityID, userId]);

  // Subir archivo
  const handleFileUpload = async () => {
    if (hasReachedLimit) {
      setUploadError("Has alcanzado el número máximo de intentos permitidos.");
      return;
    }
    if (!files || files.length === 0) {
      setUploadError("Por favor selecciona al menos un archivo.");
      return;
    }
    if (hasDeadlinePassed()) {
      setUploadError(
        "La fecha límite ha expirado. No se pueden subir entregas."
      );
      return;
    }
    setUploadError(null);
    setLoading((prev) => ({ ...prev, upload: true }));

    try {
      // 1. Crear la entrega (submission) sin archivos
      const submissionResp = await api.post(
        `/activities/${activity.ActivityID}/submissions`
      );

      const submissionId = submissionResp.data.submissionId;

      if (!submissionId) {
        throw new Error("No se pudo crear la entrega.");
      }

      // 2. Subir archivos uno por uno asociados a la entrega creada
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post(`/submissions/${submissionId}/files`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // 3. Refrescar datos y limpiar archivos
      await fetchFiles();
      setFiles([]);
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Error inesperado al subir archivos.";
      setUploadError(msg);
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const usedAttempts = useMemo(() => {
    const count = new Set(submissions.map((s) => s.SubmissionID)).size;
    return count;
  }, [submissions]);

  const hasReachedLimit = useMemo(() => {
    const max = activity?.MaxSubmissions || 1;
    const count = new Set(submissions.map((s) => s.SubmissionID)).size;
    const reached = count >= max;
    return reached;
  }, [submissions, activity?.MaxSubmissions]);

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
              <FontAwesomeIcon
                icon={faUpload}
                className="text-blue-600 text-lg"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Entregar tarea
            </h3>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-blue-50/50 p-4 rounded-xl">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400" />
            <p className="text-sm text-gray-600 mb-4">
              Intentos usados: <strong>{usedAttempts}</strong> /{" "}
              <strong>{activity?.MaxSubmissions || 1}</strong>
              {hasReachedLimit && (
                <span className="ml-4 px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                  Has alcanzado el máximo de intentos
                </span>
              )}
            </p>
          </div>

          {hasDeadlinePassed() ? (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-start gap-3 mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-yellow-500 mt-1"
              />
              <div>
                <p className="text-yellow-700 font-medium">
                  Entrega no permitida
                </p>
                <p className="text-yellow-600 text-sm">
                  Ya pasó la fecha límite de entrega para esta actividad.
                </p>
              </div>
            </div>
          ) : hasReachedLimit ? (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3 mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-400 mt-1"
              />
              <div>
                <p className="text-red-600 font-medium">Límite alcanzado</p>
                <p className="text-red-500 text-sm">
                  Ya has utilizado todos los intentos permitidos para esta
                  actividad.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setFiles((prev) => [...prev, ...Array.from(e.target.files)])
                  }
                  accept=".pdf,.doc,.docx,.pptx,.mp4,.webm"
                  className="w-full opacity-0 absolute inset-0 cursor-pointer"
                  id="fileInput"
                />

                <label
                  htmlFor="fileInput"
                  className="block w-full p-8 border-2 border-dashed border-slate-300 hover:border-blue-300 rounded-xl transition-all cursor-pointer"
                >
                  <div className="text-center space-y-2">
                    <FontAwesomeIcon
                      icon={faCloudUpload}
                      className="text-3xl text-blue-400 mb-2"
                    />
                    {files.length > 0 ? (
                      <ul className="text-sm text-gray-600 space-y-1">
                        {files.map((f, i) => (
                          <li key={i} className="truncate">
                            {f.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 font-medium">
                        Haz clic o arrastra tus archivos aquí
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      Tipos permitidos: PDF, Word, MP4, WebM
                    </p>
                  </div>
                </label>

                {/* 🆕 Botón adicional para agregar archivos */}
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById("fileInput").click()}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Agregar más archivos
                  </button>
                </div>
              </div>

              {uploadError && (
                <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{uploadError}</span>
                </div>
              )}

              <button
                onClick={handleFileUpload}
                disabled={loading.upload || hasReachedLimit}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all ${
                  loading.upload || hasReachedLimit
                    ? "bg-gray-200 cursor-not-allowed text-gray-500"
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

          {submissions
            .filter((s) => s.UserID === userId)
            .sort((a, b) => new Date(b.SubmittedAt) - new Date(a.SubmittedAt))
            .length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-gray-400"
                />
                Historial de entregas
              </h4>

              {submissions
                .filter((s) => s.UserID === userId)
                .sort(
                  (a, b) => new Date(b.SubmittedAt) - new Date(a.SubmittedAt)
                )
                .map((submission) => (
                  <div
                    key={submission.SubmissionID}
                    className="bg-white p-4 rounded-xl shadow-xs border-l-4 border-blue-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-600">
                        Entrega N.º {submission.AttemptNumber} ·{" "}
                        {new Date(submission.SubmittedAt).toLocaleString()}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full font-medium text-white bg-blue-400">
                        {submission.IsFinal
                          ? "Entrega final"
                          : "Intento parcial"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="text-xs font-medium text-gray-400">
                          Calificación
                        </label>
                        <div className="text-lg font-semibold text-blue-600">
                          {submission.Score != null ? (
                            <>
                              {submission.Score}/20
                              <span className="ml-2 text-sm text-green-500">
                                ({((submission.Score / 20) * 100).toFixed(1)}%)
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400">Pendiente</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-400">
                          Retroalimentación
                        </label>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm whitespace-pre-line">
                          {submission.Feedback?.trim() || (
                            <span className="text-gray-400">
                              Sin comentarios
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {submission.files && submission.files.length > 0 ? (
                        submission.files.map((file) => (
                          <div
                            key={file.FileID}
                            className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                          >
                            <div className="flex items-center gap-2 text-gray-700">
                              <FontAwesomeIcon
                                icon={getFileIcon(file.FileType)}
                              />
                              <span className="truncate max-w-[200px]">
                                {file.FileName}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                const url = `http://localhost:5000/${file.Files}`;
                                window.open(url, "_blank");
                              }}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                            >
                              Ver archivo
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Sin archivos en esta entrega.
                        </p>
                      )}
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
