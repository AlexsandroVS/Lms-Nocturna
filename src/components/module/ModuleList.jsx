/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faEdit,
  faTrash,
  faLock,
  faUnlock,
  faEllipsisVertical,
  faArrowRight,
  faPlus,
  faChevronDown,
  faCheckCircle,
  faChevronUp,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import CreateActivityModal from "../../admin/modals/Activities/CreateActivityModal";
import EditActivityModal from "../../admin/modals/Activities/EditActivityModal";
import DeleteActivityModal from "../../admin/modals/Activities/DeleteActivityModal";

const ModuleList = ({
  modules,
  color,
  onEditModule = () => {},
  onDeleteModule = () => {},
  onLockModule = () => {},
  onShowActivityDetail = () => {},
}) => {
  const { currentUser, api } = useAuth();
  const navigate = useNavigate();

  const [activitiesByModule, setActivitiesByModule] = useState({});
  const [openMenuModuleId, setOpenMenuModuleId] = useState(null);
  const [openActivitiesModuleId, setOpenActivitiesModuleId] = useState(null);

  // Modales de actividades
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mantenemos track de dónde creamos/ editamos/ borramos
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Menú hamburguesa por actividad
  const [openMenuActivityId, setOpenMenuActivityId] = useState(null);
  const [submittedActivities, setSubmittedActivities] = useState([]);

  // Cargar actividades de cada módulo
  const fetchActivities = async (courseId, moduleId) => {
    try {
      const resp = await api.get(
        `/courses/${courseId}/modules/${moduleId}/activities`
      );
      setActivitiesByModule((prev) => ({
        ...prev,
        [moduleId]: resp.data,
      }));
    } catch (err) {
      console.error("Error al obtener actividades:", err);
    }
  };

  useEffect(() => {
    modules.forEach((mod) => {
      if (!activitiesByModule[mod.ModuleID]) {
        fetchActivities(mod.CourseID, mod.ModuleID);
      }
    });
  }, [modules, activitiesByModule]);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (!currentUser?.id || !["student", "user"].includes(currentUser.role))
        return;

      try {
        const allActivities = modules.flatMap(
          (mod) => activitiesByModule[mod.ModuleID] || []
        );

        const submissionChecks = await Promise.all(
          allActivities.map(async (activity) => {
            try {
              const res = await api.get(
                `/activities/${activity.ActivityID}/users/${currentUser.id}/submissions`
              );
              return res.data.length > 0 ? activity.ActivityID : null;
            } catch (err) {
              return null;
            }
          })
        );

        const submitted = submissionChecks.filter(Boolean);
        setSubmittedActivities(submitted);
      } catch (err) {
        console.error("Error al verificar entregas del usuario:", err);
      }
    };

    fetchUserSubmissions();
  }, [modules, activitiesByModule, currentUser?.id]);

  // Bloquear / Desbloquear
  const handleLockToggle = async (moduleId, currentLockStatus) => {
    try {
      const newLockStatus = currentLockStatus === 1 ? 0 : 1;
      if (modules.length > 0) {
        await api.put(`/courses/${modules[0].CourseID}/modules/${moduleId}`, {
          isLocked: newLockStatus,
        });
      }
      onLockModule(moduleId, newLockStatus);
    } catch (err) {
      console.error("Error al bloquear/desbloquear módulo:", err);
    }
  };

  // Mostrar menú del módulo
  const toggleModuleMenu = (moduleId, e) => {
    e.stopPropagation();
    setOpenMenuModuleId((prev) => (prev === moduleId ? null : moduleId));
  };
  const isModuleMenuOpen = (moduleId) => openMenuModuleId === moduleId;

  // Desplegar/ocultar lista de actividades
  const toggleActivities = (moduleId) => {
    setOpenActivitiesModuleId((prev) => (prev === moduleId ? null : moduleId));
  };
  const areActivitiesOpen = (moduleId) => openActivitiesModuleId === moduleId;

  // Crear actividad
  const handleCreateActivity = async (newActivity) => {
    if (!selectedModuleId) return false;

    const formData = new FormData();
    formData.append("title", newActivity.title);
    formData.append("content", newActivity.content);
    formData.append("deadline", newActivity.deadline);
    formData.append("maxSubmissions", newActivity.maxSubmissions);

    console.log("📎 Archivos recibidos:", newActivity.files);
    for (let file of newActivity.files) {
      formData.append("file", file); // 🔥 ¡Este debe llamarse "file" y repetirse!
    }

    try {
      const response = await api.post(
        `/courses/${modules[0].CourseID}/modules/${selectedModuleId}/activities`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchActivities(modules[0].CourseID, selectedModuleId);
      setShowCreateModal(false);
      setSelectedModuleId(null);
      return true;
    } catch (error) {
      console.error("❌ Error al crear la actividad:", error);
      return false;
    }
  };

  // Editar actividad
  const handleEditActivity = async () => {
    if (selectedModuleId) {
      await fetchActivities(modules[0].CourseID, selectedModuleId);
    }
    setShowEditModal(false);
  };

  // Eliminar actividad
  const handleDeleteActivity = async (activityId) => {
    try {
      await api.delete(`/activities/${activityId}`);
      if (selectedModuleId) {
        await fetchActivities(modules[0].CourseID, selectedModuleId);
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("❌ Error al eliminar la actividad:", error);
    }
  };

  // Manejar clic en "Ver actividad"
  const handleViewClick = (activity, mod, e) => {
    e.stopPropagation();
    onShowActivityDetail(activity);
  };

  // Menú por actividad
  const toggleActivityMenu = (activityId, e) => {
    e.stopPropagation();
    setOpenMenuActivityId((prev) => (prev === activityId ? null : activityId));
  };
  const isActivityMenuOpen = (activityId) => openMenuActivityId === activityId;

  return (
    <div className="space-y-6">
      {modules.map((mod) => {
        const totalActivities = activitiesByModule[mod.ModuleID]?.length || 0;
        const isLocked = !!mod.isLocked;
        const isModuleOpen = areActivitiesOpen(mod.ModuleID);

        return (
          <motion.div
            key={mod.ModuleID}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl  h transition-shadow p-6 group relative"
          >
            {/* Encabezado del Módulo */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-3">
                  {(currentUser?.role === "admin" ||
                    currentUser?.role === "teacher") && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`p-2 rounded-lg ${
                        isLocked ? "bg-amber-100" : "bg-emerald-100"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={isLocked ? faLock : faUnlock}
                        className={`text-lg ${
                          isLocked ? "text-amber-600" : "text-emerald-600"
                        }`}
                      />
                    </motion.div>
                  )}
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {mod.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="text-gray-400"
                    />
                    <span>
                      {totalActivities}{" "}
                      {totalActivities === 1 ? "actividad" : "actividades"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controles del Módulo */}
              <div className="flex items-center gap-3">
                {(currentUser?.role === "admin" ||
                  currentUser?.role === "teacher") && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      onClick={() => {
                        setSelectedModuleId(mod.ModuleID);
                        setShowCreateModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-lg" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      onClick={(e) => toggleModuleMenu(mod.ModuleID, e)}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </motion.button>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  onClick={() => toggleActivities(mod.ModuleID)}
                >
                  <FontAwesomeIcon
                    icon={isModuleOpen ? faChevronUp : faChevronDown}
                    className="text-sm transition-transform duration-200"
                  />
                </motion.button>
              </div>
            </div>

            {/* Menú del Módulo */}
            {isModuleMenuOpen(mod.ModuleID) &&
              (currentUser?.role === "admin" ||
                currentUser?.role === "teacher") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: {
                      opacity: { duration: 0.2 },
                      height: { type: "spring", stiffness: 300, damping: 20 },
                    },
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-gray-50 rounded-xl p-4 space-y-2 overflow-hidden"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-full p-3 rounded-lg bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                    onClick={() => onEditModule(mod)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-amber-600" />
                    <span>Editar Módulo</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-full p-3 rounded-lg bg-white hover:bg-gray-50 text-gray-700 flex items-center gap-3"
                    onClick={() => handleLockToggle(mod.ModuleID, mod.isLocked)}
                  >
                    <FontAwesomeIcon
                      icon={isLocked ? faUnlock : faLock}
                      className={
                        isLocked ? "text-emerald-600" : "text-amber-600"
                      }
                    />
                    <span>{isLocked ? "Desbloquear" : "Bloquear"} Módulo</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4 }}
                    className="w-full p-3 rounded-lg bg-white hover:bg-gray-50 text-red-600 flex items-center gap-3"
                    onClick={() => onDeleteModule(mod.ModuleID)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Eliminar Módulo</span>
                  </motion.button>
                </motion.div>
              )}

            {/* Lista de Actividades */}
            <AnimatePresence>
              {isModuleOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: {
                      opacity: { duration: 0.3 },
                      height: {
                        type: "spring",
                        stiffness: 250,
                        damping: 20,
                        duration: 0.5,
                      },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                      opacity: { duration: 0.2 },
                      height: { duration: 0.3 },
                    },
                  }}
                  className="mt-6 space-y-3 overflow-hidden"
                >
                  {activitiesByModule[mod.ModuleID]?.map((activity, idx) => (
                    <motion.div
                      key={activity.ActivityID}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: idx * 0.05 },
                      }}
                      whileHover={{ y: -2 }}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-white transition-colors "
                    >
                      {/* Primera fila: Título y botón de opciones  */}
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-800 truncate flex items-center gap-2">
                            {activity.Title}
                            {submittedActivities.includes(
                              activity.ActivityID
                            ) && (
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-green-500 text-sm"
                                title="Tarea enviada"
                              />
                            )}
                          </h4>
                        </div>

                        {(currentUser?.role === "admin" ||
                          currentUser?.role === "teacher") && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                            onClick={(e) => {
                              toggleActivityMenu(activity.ActivityID, e);
                              setSelectedActivity(activity);
                            }}
                          >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </motion.button>
                        )}
                      </div>

                      {/* Segunda fila: Fecha y botón principal */}
                      <div className="flex items-center justify-between gap-4">
                        {activity.deadline && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>
                              📅{" "}
                              {new Date(activity.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                            currentUser?.role === "admin" ||
                            currentUser?.role === "teacher"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-purple-600 hover:bg-purple-700 text-white"
                          }`}
                          onClick={(e) => handleViewClick(activity, mod, e)}
                        >
                          <FontAwesomeIcon icon={faArrowRight} />
                          <span>Ver</span>
                        </motion.button>
                      </div>

                      {/* Menú Actividad (solo admin) */}
                      <AnimatePresence>
                        {isActivityMenuOpen(activity.ActivityID) &&
                          (currentUser?.role === "admin" ||
                            currentUser?.role === "teacher") && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                                transition: {
                                  opacity: { duration: 0.2 },
                                  height: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                  },
                                },
                              }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-100 space-y-2 overflow-hidden"
                            >
                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full px-4 py-2 text-left rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2"
                                onClick={() => {
                                  setSelectedActivity(activity);
                                  setSelectedModuleId(mod.ModuleID); // 🔧 Establecer módulo
                                  setShowEditModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                                <span>Editar Actividad</span>
                              </motion.button>

                              <motion.button
                                whileHover={{ x: 4 }}
                                className="w-full px-4 py-2 text-left rounded-lg hover:bg-red-50 text-red-700 flex items-center gap-2"
                                onClick={() => {
                                  setSelectedModuleId(mod.ModuleID); // <-- Agregar
                                  setSelectedActivity(activity);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Eliminar Actividad</span>
                              </motion.button>
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* MODALES PARA ACTIVIDADES */}
      {showCreateModal && (
        <CreateActivityModal
          onClose={() => {
            setShowCreateModal(false);
            setSelectedModuleId(null);
          }}
          onSave={handleCreateActivity}
        />
      )}
      {showEditModal && selectedActivity && (
        <EditActivityModal
          activity={selectedActivity}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleEditActivity}
        />
      )}
      {showDeleteModal && selectedActivity && (
        <DeleteActivityModal
          activity={selectedActivity}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteActivity}
        />
      )}
    </div>
  );
};

export default ModuleList;
