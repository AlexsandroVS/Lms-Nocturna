/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFile,
  faChevronDown,
  faChevronUp,
  faTimes,
  faFileWord,
  faSpinner,
  faFilePdf,
  faClock,
  faCheckCircle,
  faEdit,
  faUserCheck,
  faCommentDots,
  faSearch,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import PDFPreviewModal from "../components/files/PDFPreviewModal";
import { motion, AnimatePresence } from "framer-motion";
import StudentsWithoutSubmissions from "../components/files/StudentsWithoutSubmissions";

const FilesPage = () => {
  const { api, currentUser } = useAuth();
  const { courseId, activityId } = useParams();

  const [usersWithSubmissions, setUsersWithSubmissions] = useState([]);
  const [usersWithoutSubmissions, setUsersWithoutSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityDetails, setActivityDetails] = useState({
    name: "",
    deadline: null,
    maxSubmissions: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGrade, setEditingGrade] = useState(null);
  const [tempGrade, setTempGrade] = useState("");
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [openSubmissions, setOpenSubmissions] = useState({});

  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Obtener detalles de la actividad
        const activityResp = await api.get(`/activities/${activityId}`);
        const {
          Title: name,
          Deadline: deadline,
          MaxSubmissions: maxSubmissions,
        } = activityResp.data;
        setActivityDetails({ name, deadline, maxSubmissions });

        // 2. Obtener todas las entregas con archivos y datos de usuario
        const submissionsResp = await api.get(
          `/activities/${activityId}/submissions/all`
        );
        const allSubmissions = submissionsResp.data;

        // 3. Agrupar por usuario
        const usersMap = new Map();

        allSubmissions.forEach((sub) => {
          if (!usersMap.has(sub.UserID)) {
            usersMap.set(sub.UserID, {
              user: {
                UserID: sub.UserID,
                Name: sub.UserName,
                Email: sub.UserEmail,
              },
              submissions: [],
              finalSubmission: null,
            });
          }

          const submissionData = {
            ...sub,
            files: sub.files || [],
            isFinal: sub.IsFinal || false,
          };

          const userData = usersMap.get(sub.UserID);
          userData.submissions.push(submissionData);

          if (submissionData.isFinal) {
            userData.finalSubmission = submissionData;
          }
        });

        const usersWithSub = Array.from(usersMap.values());
        setUsersWithSubmissions(usersWithSub);

        // 4. Obtener inscripciones (para detectar usuarios sin entrega)
        const enrollmentsResp = await api.get(
          `/enrollments?courseId=${courseId}`
        );
        const allStudents = enrollmentsResp.data.map((e) => ({
          UserID: e.UserID || e.StudentID,
          Name: e.Name || e.StudentName,
          Email: e.Email || e.StudentEmail || "",
        }));

        const usersWithIds = new Set(usersWithSub.map((u) => u.user.UserID));
        const usersWithoutSub = allStudents.filter(
          (u) => !usersWithIds.has(u.UserID)
        );
        setUsersWithoutSubmissions(usersWithoutSub);
      } catch (err) {
        console.error("Error fetching optimized submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activityId, courseId, api]);

  const handleMarkAsFinal = async (submissionId, userId) => {
    try {
      await api.put(`/submissions/${submissionId}/final`, {
        activityId,
        userId,
      });

      // Update local state
      setUsersWithSubmissions((prev) =>
        prev.map((userData) => {
          if (userData.user.UserID !== userId) return userData;

          return {
            ...userData,
            submissions: userData.submissions.map((sub) => ({
              ...sub,
              isFinal: sub.SubmissionID === submissionId,
            })),
            finalSubmission: userData.submissions.find(
              (sub) => sub.SubmissionID === submissionId
            ),
          };
        })
      );
    } catch (err) {
      console.error("Error marking as final:", err);
      alert("Error al marcar como entrega final");
    }
  };

  const saveGrade = async (submissionId) => {
    try {
      if (tempGrade === "" || isNaN(tempGrade)) {
        alert("La calificación debe ser un número");
        return;
      }

      const parsedScore = parseFloat(tempGrade);

      await api.patch(`/submissions/${submissionId}/score`, {
        score: parsedScore,
      });

      // Actualizar estado local con la nueva nota
      setUsersWithSubmissions((prev) =>
        prev.map((userData) => ({
          ...userData,
          submissions: userData.submissions.map((sub) =>
            sub.SubmissionID === submissionId
              ? { ...sub, Score: parsedScore }
              : sub
          ),
          finalSubmission:
            userData.finalSubmission?.SubmissionID === submissionId
              ? { ...userData.finalSubmission, Score: parsedScore }
              : userData.finalSubmission,
        }))
      );

      setEditingGrade(null);
    } catch (error) {
      alert("Error al guardar calificación");
    }
  };

  const openFeedbackModal = (submission) => {
    setEditingFeedback(submission);
    setFeedbackText(submission.Feedback || "");
  };

  const handleSaveFeedback = async () => {
    try {
      await api.patch(`/submissions/${editingFeedback.SubmissionID}/feedback`, {
        feedback: feedbackText,
      });

      // Update local state
      setUsersWithSubmissions((prev) =>
        prev.map((userData) => ({
          ...userData,
          submissions: userData.submissions.map((sub) =>
            sub.SubmissionID === editingFeedback.SubmissionID
              ? { ...sub, Feedback: feedbackText }
              : sub
          ),
          finalSubmission:
            userData.finalSubmission?.SubmissionID ===
            editingFeedback.SubmissionID
              ? { ...userData.finalSubmission, Feedback: feedbackText }
              : userData.finalSubmission,
        }))
      );

      setEditingFeedback(null);
    } catch (err) {
      alert("Error al guardar feedback");
    }
  };

  const cancelEdit = () => {
    setEditingGrade(null);
    setTempGrade("");
  };
  const filteredWithSubmissions = usersWithSubmissions.filter((userData) =>
    userData.user?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWithoutSubmissions = usersWithoutSubmissions.filter((user) =>
    user?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLate = (submittedAt, deadline) =>
    deadline && new Date(submittedAt) > new Date(deadline);

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith(".pdf")) return faFilePdf;
    if (fileName?.match(/\.docx?$/)) return faFileWord;
    return faFile;
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "download";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error al descargar archivo");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex-1 p-4 md:p-6 lg:p-8 bg-white"
    >
      {/* Header - Rediseñado para responsive */}
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 w-full">
          <div className="space-y-2">
            <motion.h1
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-bold text-slate-800"
            >
              {activityDetails.name}
            </motion.h1>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                <span>
                  {activityDetails.deadline
                    ? new Date(activityDetails.deadline).toLocaleDateString()
                    : "Sin fecha límite"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FontAwesomeIcon icon={faStar} className="text-purple-500" />
                <span>
                  {activityDetails.maxSubmissions > 0
                    ? `Máx. ${activityDetails.maxSubmissions} intentos`
                    : "Intentos ilimitados"}
                </span>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            className="relative w-full lg:w-80"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-purple-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="pl-10 pr-4 py-2 w-full rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
        </div>
      </header>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
              damping: 10,
            }}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-3xl text-purple-500"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-slate-500"
          >
            Cargando entregas...
          </motion.p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {/* Main content - Mejorado para responsive */}
          <div className="space-y-6 w-full">
            {/* Users with submissions - Rediseñado */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm w-full"
            >
              <div className="px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-purple-50 to-purple-50 border-b border-slate-200">
                <h2 className="flex items-center gap-3 text-base md:text-lg font-semibold text-slate-800">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="text-purple-600"
                  />
                  Entregas ({filteredWithSubmissions.length})
                </h2>
              </div>

              <div className="divide-y divide-slate-100 w-full">
                {filteredWithSubmissions.map((userData) => (
                  <motion.div
                    key={`user-container-${userData.user.UserID}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 md:p-5 hover:bg-slate-50/50 transition-colors duration-150 w-full"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                      <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center shadow-inner">
                          <span className="text-purple-700 font-medium text-base sm:text-lg">
                            {userData.user.Name.charAt(0)}
                          </span>
                        </div>
                        <div className="sm:hidden">
                          {userData.finalSubmission ? (
                            <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              Entregado
                            </span>
                          ) : (
                            <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              Pendiente
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-800 truncate">
                              {userData.user.Name}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">
                              {userData.user.Email}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            {userData.finalSubmission ? (
                              <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                Entregado
                              </span>
                            ) : (
                              <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                Pendiente de selección
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Submissions list - Mejorado para responsive */}
                        <div className="mt-3 sm:ml-2 space-y-3">
                          {userData.submissions.map((submission) => {
                            const isOpen =
                              openSubmissions[submission.SubmissionID] || false;
                            return (
                              <motion.div
                                key={`submission-${submission.SubmissionID}`}
                                className={`p-3 sm:p-4 rounded-lg border ${
                                  submission.isFinal
                                    ? "border-purple-300 bg-purple-50/50"
                                    : "border-slate-200"
                                } shadow-xs`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">
                                      Entrega {submission.AttemptNumber}
                                    </p>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                      {new Date(
                                        submission.SubmittedAt
                                      ).toLocaleString()}
                                      {isLate(
                                        submission.SubmittedAt,
                                        activityDetails.deadline
                                      ) && (
                                        <span className="ml-2 text-amber-600">
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            className="mr-1"
                                          />
                                          Tardío
                                        </span>
                                      )}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                                    {/* Grade section */}
                                    <div className="flex items-center gap-2">
                                      {editingGrade ===
                                      submission.SubmissionID ? (
                                        <>
                                          <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            step="0.1"
                                            value={tempGrade}
                                            onChange={(e) =>
                                              setTempGrade(e.target.value)
                                            }
                                            className="w-16 sm:w-20 p-1 rounded-lg bg-slate-50 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all border border-slate-200"
                                          />
                                          <button
                                            onClick={() =>
                                              saveGrade(submission.SubmissionID)
                                            }
                                            className="text-green-600 hover:text-green-700 transition-colors"
                                            title="Guardar"
                                          >
                                            <FontAwesomeIcon
                                              icon={faCheckCircle}
                                              size="sm"
                                            />
                                          </button>
                                          <button
                                            onClick={cancelEdit}
                                            className="text-red-600 hover:text-red-700 transition-colors"
                                            title="Cancelar"
                                          >
                                            <FontAwesomeIcon
                                              icon={faTimes}
                                              size="sm"
                                            />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            className={`text-base sm:text-lg font-semibold ${
                                              submission.Score >= 14
                                                ? "text-green-600"
                                                : submission.Score >= 10
                                                ? "text-amber-500"
                                                : "text-red-600"
                                            }`}
                                          >
                                            {submission.Score !== null
                                              ? submission.Score
                                              : "-"}
                                          </span>
                                          {(currentUser?.role === "teacher" ||
                                            currentUser?.role === "admin") && (
                                            <button
                                              onClick={() => {
                                                setEditingGrade(
                                                  submission.SubmissionID
                                                );
                                                setTempGrade(
                                                  submission.Score ?? ""
                                                );
                                              }}
                                              className="text-purple-600 hover:text-purple-800 transition-colors"
                                              title="Editar calificación"
                                            >
                                              <FontAwesomeIcon
                                                icon={faEdit}
                                                size="sm"
                                              />
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </div>

                                    {/* Action buttons - Reorganizado para responsive */}
                                    <div className="flex items-center gap-1 sm:gap-2">
                                      {(currentUser?.role === "teacher" ||
                                        currentUser?.role === "admin") && (
                                        <>
                                          <button
                                            onClick={() =>
                                              openFeedbackModal(submission)
                                            }
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Agregar feedback"
                                          >
                                            <FontAwesomeIcon
                                              icon={faCommentDots}
                                              size="sm"
                                            />
                                          </button>

                                          {!submission.isFinal && (
                                            <button
                                              onClick={() =>
                                                handleMarkAsFinal(
                                                  submission.SubmissionID,
                                                  userData.user.UserID
                                                )
                                              }
                                              className="hidden sm:inline-block px-2 py-1 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-full transition-colors shadow-sm"
                                              title="Marcar como final"
                                            >
                                              Final
                                            </button>
                                          )}
                                        </>
                                      )}

                                      {submission.isFinal ? (
                                        <span className="hidden sm:inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                          Final
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            handleMarkAsFinal(
                                              submission.SubmissionID,
                                              userData.user.UserID
                                            )
                                          }
                                          className="sm:hidden px-2 py-1 text-xs bg-purple-600 text-white hover:bg-purple-700 rounded-full transition-colors shadow-sm"
                                          title="Marcar como final"
                                        >
                                          Final
                                        </button>
                                      )}

                                      <button
                                        onClick={() =>
                                          setOpenSubmissions((prev) => ({
                                            ...prev,
                                            [submission.SubmissionID]: !isOpen,
                                          }))
                                        }
                                        className="text-purple-600 hover:text-purple-800 transition-colors"
                                        title={
                                          isOpen
                                            ? "Ocultar archivos"
                                            : "Mostrar archivos"
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={
                                            isOpen ? faChevronUp : faChevronDown
                                          }
                                          size="sm"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Archivos colapsables - Mejorado para responsive */}
                                {isOpen && (
                                  <div className="mt-3 sm:ml-4 space-y-2">
                                    {submission.files.length > 0 ? (
                                      submission.files.map((file) => (
                                        <div
                                          key={`file-${file.FileID}-${submission.SubmissionID}`}
                                          className="flex items-center justify-between bg-slate-50 p-2 sm:p-3 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                          <div className="flex items-center gap-2 sm:gap-3 text-slate-700 min-w-0">
                                            <FontAwesomeIcon
                                              icon={getFileIcon(file.FileName)}
                                              className={`text-lg ${
                                                file.FileName?.endsWith(".pdf")
                                                  ? "text-red-500"
                                                  : file.FileName?.match(
                                                      /\.docx?$/
                                                    )
                                                  ? "text-blue-500"
                                                  : "text-slate-500"
                                              }`}
                                            />
                                            <span className="truncate flex-1">
                                              {file.FileName}
                                            </span>
                                          </div>
                                          <div className="flex gap-2 sm:gap-3">
                                            {file.FileType ===
                                              "application/pdf" && (
                                              <button
                                                onClick={() => {
                                                  setPreviewPdfUrl(
                                                    `http://localhost:5000/${file.Files}`
                                                  );
                                                  setShowPdfModal(true);
                                                }}
                                                title="Previsualizar PDF"
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                              >
                                                <FontAwesomeIcon
                                                  icon={faSearch}
                                                  size="sm"
                                                />
                                              </button>
                                            )}
                                            <button
                                              onClick={() =>
                                                handleDownload(
                                                  `http://localhost:5000/${file.Files}`,
                                                  file.FileName
                                                )
                                              }
                                              title="Descargar"
                                              className="text-green-600 hover:text-green-800 transition-colors"
                                            >
                                              <FontAwesomeIcon
                                                icon={faDownload}
                                                size="sm"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-xs sm:text-sm text-slate-400 italic">
                                        Sin archivos en esta entrega.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Users without submissions */}
            {(currentUser?.role === "teacher" ||
              currentUser?.role === "admin") && (
              <StudentsWithoutSubmissions
                students={filteredWithoutSubmissions}
              />
            )}

            {/* Empty states */}
            {filteredWithSubmissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-12 sm:py-16"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                >
                  <FontAwesomeIcon
                    icon={searchTerm ? faSearch : faFile}
                    className="text-4xl sm:text-5xl text-purple-200 mb-4"
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-700">
                  {searchTerm
                    ? "No se encontraron resultados"
                    : "No hay entregas aún"}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md mx-auto">
                  {searchTerm
                    ? `No hay coincidencias para "${searchTerm}"`
                    : "Los estudiantes podrán subir sus archivos aquí"}
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      )}

      {/* Modals (sin cambios) */}
      {editingFeedback && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md transform transition-all border border-slate-200">
            <div className="flex justify-between items-center px-6 py-5 bg-slate-50 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">
                Editar Feedback
              </h2>
              <button
                onClick={() => setEditingFeedback(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                aria-label="Cerrar"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-slate-500 hover:text-slate-700 text-lg transition-colors"
                />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <textarea
                rows={5}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400 resize-none outline-none"
                placeholder="Escribe tu feedback aquí..."
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setEditingFeedback(null)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveFeedback}
                  className="px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PDFPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        fileUrl={previewPdfUrl}
      />
    </motion.div>
  );
};

export default FilesPage;
