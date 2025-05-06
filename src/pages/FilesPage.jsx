import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFile,
  faTimes,
  faFileWord,
  faSpinner,
  faFilePdf,
  faClock,
  faCheckCircle,
  faEdit,
  faUserCheck,
  faUserClock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import PDFPreviewModal from "../components/files/PDFPreviewModal";

import { motion, AnimatePresence } from "framer-motion";

const FilesPage = () => {
  const { api, currentUser } = useAuth();
  const { activityId } = useParams();

  const [submittedUsers, setSubmittedUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notSubmittedUsers, setNotSubmittedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityDetails, setActivityDetails] = useState({
    name: "",
    deadline: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGrade, setEditingGrade] = useState(null);
  const [tempGrade, setTempGrade] = useState("");
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener datos de actividad y usuarios
        const [usersResp, activityResp, filesResp] = await Promise.all([
          api.get("/users"),
          api.get(`/activities/${activityId}`),
          api.get(`/activities/${activityId}/files`),
        ]);

        const { Title: name, Deadline: deadline } = activityResp.data;
        setActivityDetails({ name, deadline });

        // Filtrar usuarios estudiantes
        const students = usersResp.data.filter((user) => user.Role !== "admin");

        // Obtener entregas con calificaciones
        const submissionsWithGrades = await Promise.all(
          filesResp.data
            .filter((file) => students.some((s) => s.UserID === file.UserID))
            .map(async (file) => {
              const gradeResp = await api.get(
                `/grades/user/${file.UserID}/activity/${activityId}`
              );
              return {
                ...file,
                grade: gradeResp.data?.data || null,
                user: students.find((u) => u.UserID === file.UserID),
              };
            })
        );

        // Separar usuarios que entregaron vs no entregaron
        const submittedUserIds = submissionsWithGrades.map((s) => s.UserID);
        const notSubmitted = students.filter(
          (s) => !submittedUserIds.includes(s.UserID)
        );

        setSubmittedUsers(submissionsWithGrades);
        setNotSubmittedUsers(notSubmitted);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activityId, api]);

  const handleGradeChange = (userId, grade) => {
    setEditingGrade(userId);
    setTempGrade(grade);
  };

  const saveGrade = async (userId) => {
    try {
      if (
        tempGrade === "" ||
        isNaN(tempGrade) ||
        tempGrade < 0 ||
        tempGrade > 20
      ) {
        alert("La calificación debe ser un número entre 0 y 20");
        return;
      }
  
      const parsedScore = parseFloat(tempGrade);
  
      // Guardar en Grades
      await api.post(`/grades/user/${userId}/activity/${activityId}`, {
        score: parsedScore,
      });
  
      // Obtener el archivo entregado por ese usuario
      const fileToUpdate = submittedUsers.find((u) => u.user.UserID === userId);
  
      // Guardar también en Files
      if (fileToUpdate) {
        await api.patch(`/files/${fileToUpdate.FileID}/score`, {
          score: parsedScore,
        });
      }
  
      // Actualizar estado local
      setSubmittedUsers((prev) =>
        prev.map((u) =>
          u.UserID === userId ? { ...u, grade: parsedScore } : u
        )
      );
  
      setEditingGrade(null);
    } catch (err) {
      console.error("Error al guardar calificación:", err);
      alert("Error al guardar calificación");
    }
  };
  

  const openFeedbackModal = (file) => {
    setEditingFeedback(file);
    setFeedbackText(file.Feedback || "");
  };

  const handleSaveFeedback = async () => {
    try {
      await api.patch(`/files/${editingFeedback.FileID}/feedback`, {
        feedback: feedbackText,
      });
      setSubmittedUsers((prev) =>
        prev.map((f) =>
          f.FileID === editingFeedback.FileID
            ? { ...f, Feedback: feedbackText }
            : f
        )
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

  const filteredSubmitted = submittedUsers.filter((user) =>
    user.user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotSubmitted = notSubmittedUsers.filter((user) =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLate = (createdAt, deadline) =>
    deadline && new Date(createdAt) > new Date(deadline);

  const getFileIcon = (type) => {
    if (type === "application/pdf") return faFilePdf;
    if (type.includes("word")) return faFileWord;
    return faFile;
  };

  const handleDownload = async (file) => {
    try {
      const response = await api.get(`/files/${file.FileID}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.FileName;
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
      className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-xs"
    >
      {/* Encabezado elegante */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <motion.h1
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2"
            >
              {activityDetails.name}
            </motion.h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <FontAwesomeIcon icon={faClock} className="text-red-300" />
              </motion.div>
              <span>
                {activityDetails.deadline
                  ? new Date(activityDetails.deadline).toLocaleDateString()
                  : "Sin fecha límite"}
              </span>
            </div>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            className="relative w-full md:w-80"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-red-300" />
            </div>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="pl-10 pr-4 py-2.5 w-full rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-200 shadow-inner"
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
              className="text-3xl text-red-300"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-500"
          >
            Cargando entregas...
          </motion.p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {/* Sección principal */}
          <div className="space-y-8">
            {/* Tarjeta de entregas */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-red-50 to-pink-50">
                <h2 className="flex items-center gap-3 text-lg font-medium text-gray-800">
                  <FontAwesomeIcon
                    icon={faUserCheck}
                    className="text-red-400"
                  />
                  Entregas ({filteredSubmitted.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-red-50">
                      {[
                        "Estudiante",
                        "Archivo",
                        "Estado",
                        "Calificación",
                        "Acciones",
                      ].map((header, i) => (
                        <motion.th
                          key={header}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className="px-5 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                        >
                          {header}
                        </motion.th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence>
                      {filteredSubmitted.map((submission) => (
                        <motion.tr
                          key={submission.FileID}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group"
                        >
                          {/* Celda Estudiante */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"
                              >
                                <span className="text-red-500 font-medium">
                                  {submission.user.Name.charAt(0)}
                                </span>
                              </motion.div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {submission.user.Name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {submission.user.Email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Celda Archivo */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <FontAwesomeIcon
                                icon={getFileIcon(submission.FileType)}
                                className="text-red-400 text-xl"
                              />
                              <div>
                                <div className="font-medium text-gray-800 truncate max-w-xs">
                                  {submission.FileName}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(
                                    submission.CreatedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Celda Estado */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {isLate(
                              submission.CreatedAt,
                              activityDetails.deadline
                            ) ? (
                              <motion.span
                                whileHover={{ scale: 1.03 }}
                                className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-600"
                              >
                                <FontAwesomeIcon
                                  icon={faClock}
                                  className="mr-1.5"
                                />
                                Tardío
                              </motion.span>
                            ) : (
                              <motion.span
                                whileHover={{ scale: 1.03 }}
                                className="px-3 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-600"
                              >
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  className="mr-1.5"
                                />
                                A tiempo
                              </motion.span>
                            )}
                          </td>

                          {/* Celda Calificación */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            {editingGrade === submission.user.UserID ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="number"
                                  value={tempGrade}
                                  onChange={(e) => setTempGrade(e.target.value)}
                                  className="w-20 p-1.5 rounded-lg bg-gray-50 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all"
                                  min="0"
                                  max="20"
                                  step="0.1"
                                />
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() =>
                                    saveGrade(submission.user.UserID)
                                  }
                                  className="text-green-500 hover:text-green-600"
                                >
                                  <FontAwesomeIcon icon={faCheckCircle} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={cancelEdit}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </motion.button>
                              </motion.div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-medium ${
                                    submission.grade >= 14
                                      ? "text-green-500"
                                      : submission.grade >= 10
                                      ? "text-amber-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {submission.grade || "Sin calificar"}
                                </span>
                                {currentUser?.role === "admin" && (
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      handleGradeChange(
                                        submission.user.UserID,
                                        submission.grade || ""
                                      )
                                    }
                                    className="text-red-400 hover:text-red-500"
                                  >
                                    <FontAwesomeIcon icon={faEdit} size="xs" />
                                  </motion.button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Celda Acciones */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#ef4444" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownload(submission)}
                              title="Descargar archivo"
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setPreviewPdfUrl(
                                  `http://localhost:5000/${submission.Files.replace(
                                    /\\/g,
                                    "/"
                                  )}`
                                );
                                setShowPdfModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Previsualizar PDF"
                            >
                              <FontAwesomeIcon icon={faSearch} />
                            </motion.button>
                            <motion.button
                              onClick={() => openFeedbackModal(submission)}
                              className="p-2 text-amber-500 hover:text-amber-600"
                              title="Comentarios y retroalimentación"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Sección de pendientes */}
            {currentUser?.role === "admin" &&
              filteredNotSubmitted.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-4 bg-gradient-to-r from-red-50 to-pink-50">
                    <h2 className="flex items-center gap-3 text-lg font-medium text-gray-800">
                      <FontAwesomeIcon
                        icon={faUserClock}
                        className="text-amber-400"
                      />
                      Pendientes ({filteredNotSubmitted.length})
                    </h2>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredNotSubmitted.map((user) => (
                        <motion.div
                          key={user.UserID}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -3 }}
                          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-500 font-medium">
                                {user.Name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {user.Name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.Email}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            {/* Estados vacíos */}
            {filteredSubmitted.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-16"
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
                    className="text-5xl text-red-200 mb-4"
                  />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-700">
                  {searchTerm
                    ? "No se encontraron resultados"
                    : "No hay entregas aún"}
                </h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm
                    ? `No hay coincidencias para "${searchTerm}"`
                    : "Los estudiantes podrán subir sus archivos aquí"}
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      )}
      {editingFeedback && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center px-6 py-5 bg-gray-50/50 border-b border-gray-100/50">
              <h2 className="text-xl font-medium text-gray-900">
                Editar Feedback
              </h2>
              <button
                onClick={() => setEditingFeedback(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Cerrar"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-gray-500 hover:text-gray-700 text-lg transition-colors"
                />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <textarea
                rows={5}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-50/50 border-1 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none outline-none"
                placeholder="Escribe tu feedback aquí..."
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setEditingFeedback(null)}
                  className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveFeedback}
                  className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
