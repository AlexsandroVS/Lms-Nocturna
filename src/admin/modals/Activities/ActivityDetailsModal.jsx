/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFile,
  faCommentSlash,
  faRedo,
  faExternalLinkAlt,
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
  faFileAlt,
  faFileVideo,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const ActivityDetailsPanel = ({ activity, courseId, moduleId }) => {
  const { api, currentUser } = useAuth();
  const userId = currentUser?.id || currentUser?.UserID || currentUser?.userId;

  const navigate = useNavigate();
  const realModuleId = moduleId || activity?.ModuleID;
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") return faFilePdf;
    if (fileType.startsWith("video/")) return faFileVideo;
    return faFile;
  };
  const [files, setFiles] = useState([]);
  const MAX_FILES = 5;
  const [loading, setLoading] = useState({ upload: false, general: false });
  const [uploadError, setUploadError] = useState(null);
  const [adminFiles, setAdminFiles] = useState([]);
  const [studentFiles, setStudentFiles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const hasSubmitted = submissions.some((s) => s.UserID === userId);

  const [showFiles, setShowFiles] = useState(false);

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
      if (fileType.startsWith("video/")) return faFileVideo;
      return faFile;
    };

    const getFileColorClass = (fileType) => {
      if (fileType === "application/pdf") return "bg-red-500";
      if (fileType.startsWith("video/")) return "bg-purple-500";
      return "bg-gray-500";
    };

    return (
      <div
        ref={containerRef}
        className="group relative flex flex-col gap-2 p-3 sm:p-4 bg-white rounded-xl transition-all w-full"
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
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
          <div className="w-full relative" style={{ paddingTop: "56.25%" }}>
            <video
              controls
              className="absolute top-0 left-0 w-full h-full rounded-lg bg-black"
              playsInline
            >
              <source src={fileUrl} type={file.FileType} />
            </video>
          </div>
        )}

        {isPDF && (
          <div className="w-full flex flex-col items-center overflow-auto">
            <Document
              file={fileUrl}
              onLoadError={(error) =>
                console.error("Error cargando PDF:", error)
              }
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading="Cargando PDF..."
              noData="No se encontró PDF."
            >
              <div
                className="flex flex-col items-center"
                style={{ minWidth: `${containerWidth}px` }}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={Math.min(containerWidth * 0.98, 1000)}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="mb-4 shadow-md"
                  />
                ))}
              </div>
            </Document>
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
    <div className="px-2 sm:px-4 py-4 bg-white rounded-2xl w-full h-auto flex flex-col overflow-x-hidden">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Título a la izquierda */}
        <h2 className="text-2xl font-bold text-gray-900">{activity.Title}</h2>

        {/* Badges y botón a la derecha */}
        <div className="flex items-center flex-wrap gap-2 sm:justify-end">
          {["student", "user"].includes(currentUser?.role) && hasSubmitted && (
            <div className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium inline-flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
              />
              Entregado
            </div>
          )}

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

          {["admin", "teacher"].includes(currentUser?.role) && (
            <button
              onClick={() =>
                navigate(
                  `/courses/${courseId}/modules/${moduleId}/activities/${activity.ActivityID}/files`
                )
              }
              className="ml-2 px-4 py-2 text-purple-700 hover:text-purple-900 cursor-pointer rounded-lg text-sm font-medium transition"
            >
              Ver entregas
            </button>
          )}
        </div>
      </div>
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
            className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
              showFiles
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`}
          >
            {showFiles ? "Ocultar archivos" : "Mostrar archivos"}
          </button>
        </div>
        {showFiles && (
          <>
            <div className="flex flex-col gap-6">
              {/* Primero mostramos el video si existe */}
              {mainVideo && <FileCard file={mainVideo} showDetails={false} />}

              {/* Luego los otros archivos */}
              {otherFiles.length > 0 ? (
                otherFiles.map((file) => (
                  <FileCard key={file.FileID} file={file} />
                ))
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
              {/* Dentro del return, reemplaza el input y agrega los mensajes */}
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files);
                    if (files.length + selectedFiles.length > MAX_FILES) {
                      setUploadError(
                        `No puedes subir más de ${MAX_FILES} archivos por entrega.`
                      );
                      return;
                    }
                    setFiles((prev) => [...prev, ...selectedFiles]);
                    setUploadError(null);
                  }}
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
                      <>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {files.slice(0, 3).map((f, i) => (
                            <li key={i} className="truncate">
                              {f.name}
                            </li>
                          ))}
                          {files.length > 3 && (
                            <li className="text-gray-400">
                              +{files.length - 3} más...
                            </li>
                          )}
                        </ul>
                        <div className="text-xs text-blue-500">
                          {files.length}/{MAX_FILES} archivos
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 font-medium">
                          Haz clic o arrastra tus archivos aquí
                        </p>
                        <p className="text-sm text-gray-400">
                          Tipos permitidos: PDF, Word, MP4, WebM
                        </p>
                      </>
                    )}
                  </div>
                </label>

                <p className="text-sm text-gray-400 mt-2 text-center">
                  Máximo {MAX_FILES} archivos por entrega (50MB c/u)
                </p>
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

          {["student", "user"].includes(currentUser?.role) &&
            submissions
              .filter((s) => s.UserID === userId)
              .sort((a, b) => new Date(b.SubmittedAt) - new Date(a.SubmittedAt))
              .length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="text-gray-500"
                  />
                  <span>Historial de entregas</span>
                </h4>

                <div className="space-y-4">
                  {submissions
                    .filter((s) => s.UserID === userId)
                    .sort(
                      (a, b) =>
                        new Date(b.SubmittedAt) - new Date(a.SubmittedAt)
                    )
                    .map((submission) => (
                      <motion.div
                        key={submission.SubmissionID}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-4 rounded-xl shadow-sm border-gray-100 hover:shadow-md transition-all"
                      >
                        {/* Encabezado */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FontAwesomeIcon
                                icon={
                                  submission.IsFinal ? faFlagCheckered : faRedo
                                }
                                className="text-blue-600"
                              />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">
                                Entrega #{submission.AttemptNumber}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(
                                  submission.SubmittedAt
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              submission.IsFinal
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {submission.IsFinal
                              ? "Entrega final"
                              : "Intento parcial"}
                          </span>
                        </div>

                        {/* Contenido principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {/* Calificación */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">
                              Calificación
                            </label>
                            <div className="flex items-center gap-2">
                              {submission.Score != null ? (
                                <>
                                  <div className="text-2xl font-bold text-blue-600">
                                    {submission.Score}
                                    <span className="text-lg text-gray-400">
                                      /20
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-2"></div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <FontAwesomeIcon icon={faClock} />
                                  <span>Pendiente de calificación</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Retroalimentación */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <label className="text-xs font-medium text-gray-500 mb-1 block">
                              Retroalimentación
                            </label>
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {submission.Feedback?.trim() ? (
                                submission.Feedback
                              ) : (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <FontAwesomeIcon icon={faCommentSlash} />
                                  <span>Sin comentarios</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Archivos adjuntos */}
                        <div>
                          <label className="text-xs font-medium text-gray-500 mb-2 block">
                            Archivos adjuntos
                          </label>
                          {submission.files && submission.files.length > 0 ? (
                            <div className="grid gap-2">
                              {submission.files.map((file) => (
                                <motion.div
                                  key={file.FileID}
                                  whileHover={{ x: 2 }}
                                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${
                                        file.FileType.includes("image")
                                          ? "bg-blue-100 text-blue-600"
                                          : file.FileType.includes("pdf")
                                          ? "bg-red-100 text-red-600"
                                          : file.FileType.includes("word")
                                          ? "bg-blue-100 text-blue-600"
                                          : file.FileType.includes("excel")
                                          ? "bg-green-100 text-green-600"
                                          : file.FileType.includes("zip")
                                          ? "bg-yellow-100 text-yellow-600"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      <FontAwesomeIcon
                                        icon={getFileIcon(file.FileType)}
                                        className="text-sm"
                                      />
                                    </div>
                                    <div className="truncate max-w-[160px] sm:max-w-[200px] text-sm text-gray-700">
                                      {file.FileName}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const url = `http://localhost:5000/${file.Files}`;
                                      window.open(url, "_blank");
                                    }}
                                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                                  >
                                    <span className="hidden sm:inline">
                                      Ver
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faExternalLinkAlt}
                                      className="text-xs"
                                    />
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 p-3 rounded-lg">
                              <FontAwesomeIcon icon={faFileAlt} />
                              <span>No se adjuntaron archivos</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default ActivityDetailsPanel;
