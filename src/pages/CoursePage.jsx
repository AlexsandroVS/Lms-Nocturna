import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import CourseHeader from "../components/courses/CourseHeader";
import ModuleList from "../components/module/ModuleList";
import ActivityDetailsPanel from "../admin/modals/Activities/ActivityDetailsModal";
import { calculateCourseProgress } from "../utils/courseUtils";
import { CreateModuleModal } from "../admin/modals/CreateModuleModal";
import EditModuleModal from "../admin/modals/Modules/EditModuleModal";
import DeleteModuleModal from "../admin/modals/Modules/DeleteModuleModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronRight,
  faGripLinesVertical,
} from "@fortawesome/free-solid-svg-icons";

const CoursePage = () => {
  const { api, currentUser } = useAuth();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [averages, setAverages] = useState(null);
  
  const [loading, setLoading] = useState(true);

  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const fetchAverages = useCallback(async () => {
    try {
      const userId = currentUser?.id;
      const role = currentUser?.role;
      if (!userId || role === "admin" || role === "teacher") return;

      const response = await api.get(`/averages/${id}/${userId}`);
      setAverages(response.data);
    } catch (err) {
      console.error("Error al obtener promedios:", err);
    }
  }, [api, currentUser?.id, currentUser?.role, id]);

  useEffect(() => {
    if (!currentUser) {
      // Refresca la página completamente para desmontar el estado actual
      window.location.href = "/login";
    }
  }, [currentUser]);

  const fetchModules = useCallback(async () => {
    try {
      const response = await api.get(`/courses/${id}/modules`);
      const data = response.data.map((m) => ({
        ...m,
        totalActivities: m.activities?.length || 0,
      }));
      if (currentUser?.role !== "admin") {
        setModules(data.filter((m) => m.isLocked === 0));
      } else {
        setModules(data);
      }
    } catch (err) {
      console.error("Error al cargar módulos:", err);
    } finally {
      setLoading(false);
    }
  }, [api, id, currentUser?.role]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const courseResp = await api.get(`/courses/${id}`);
        setCourse(courseResp.data);
        await fetchModules();
        await fetchAverages();
      } catch (err) {
        console.error("Error al cargar curso:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, api, fetchModules, fetchAverages]);

  const handleCreateModule = async (data) => {
    try {
      await api.post(`/courses/${id}/modules`, data);
      await fetchModules();
      setShowCreateModuleModal(false);
    } catch (err) {
      console.error("Error al crear módulo:", err);
    }
  };

  const handleEditModule = async (data) => {
    if (!selectedModule?.ModuleID) return;
    try {
      await api.put(`/courses/${id}/modules/${selectedModule.ModuleID}`, data);
      await fetchModules();
      setShowEditModuleModal(false);
    } catch (err) {
      console.error("Error al editar módulo:", err);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await api.delete(`/courses/${id}/modules/${moduleId}`);
      await fetchModules();
      setShowDeleteModuleModal(false);
    } catch (err) {
      console.error("Error al eliminar módulo:", err);
    }
  };

  const handleLockModule = (moduleId, newStatus) => {
    setModules((prev) =>
      prev.map((m) =>
        m.ModuleID === moduleId ? { ...m, isLocked: newStatus } : m
      )
    );
  };

  const courseWithProgress = useMemo(() => {
    return course ? calculateCourseProgress({ ...course, modules }) : null;
  }, [course, modules]);

  const courseColor = courseWithProgress?.color;

  const togglePanelVisibility = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen  pt-[96px] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-white pt-[96px] scrollbar-hidden overflow-hidden">
      <Navbar />

      {courseWithProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6"
        >
          <CourseHeader
            course={courseWithProgress}
            color={courseColor}
            title={course.title}
            courseAverage={((averages?.courseAverage || 0) * 5).toFixed(0)}
          />
        </motion.div>
      )}

      <div className="flex flex-row gap-6 mt-6 px-6 pb-10 max-h-[calc(120vh-160px)] relative">
        {/* Detalle de Actividad */}
        <motion.div
          layout
          className={`transition-all duration-300 overflow-y-auto scrollbar-hidden ${
            isPanelVisible ? "w-[calc(100%-384px)]" : "w-full"
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedActivity ? (
              <motion.div
                key="activity-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ActivityDetailsPanel
                  activity={selectedActivity}
                  courseId={id}
                  moduleId={selectedActivity.ModuleID}
                  currentUser={currentUser}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-xl  text-gray-500 h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <p className="text-lg mb-2">
                    Selecciona una actividad para comenzar
                  </p>
                  {!isPanelVisible && (
                    <button
                      onClick={togglePanelVisibility}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                      <span>Mostrar módulos</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Panel lateral */}
        <AnimatePresence>
          {isPanelVisible && (
            <motion.div
              key="modules-panel"
              initial={{ x: 50, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              exit={{
                x: 50,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.3 }}
              className="w-[360px] overflow-y-auto scrollbar-hidden bg-white rounded-xl shadow p-4 pt-0 flex-shrink-0 border-gray-200 relative"
            >
              <div className="flex items-center justify-between mb-4">
                {/* Título y botón para crear */}
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Módulos del Curso
                  </h2>
                  {currentUser?.role === "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCreateModuleModal(true)}
                      className="flex items-center gap-2 px-3 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                      title="Agregar nuevo módulo"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </motion.button>
                  )}
                </div>

                {/* Botón de ocultar panel */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePanelVisibility}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  title="Ocultar panel de módulos"
                >
                  <FontAwesomeIcon icon={faGripLinesVertical} />
                  <span className="text-sm hidden sm:inline">Ocultar</span>
                </motion.button>
              </div>

              <div className="mt-2">
                <ModuleList
                  modules={modules}
                  color={courseColor}
                  onLockModule={handleLockModule}
                  onEditModule={(mod) => {
                    setSelectedModule(mod);
                    setShowEditModuleModal(true);
                  }}
                  onDeleteModule={(modId) => {
                    const mod = modules.find((m) => m.ModuleID === modId);
                    setSelectedModule(mod);
                    setShowDeleteModuleModal(true);
                  }}
                  onShowActivityDetail={setSelectedActivity}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botón para mostrar panel cuando está oculto */}
        <AnimatePresence>
          {!isPanelVisible && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: 1,
                x: 0,
                transition: { delay: 0.3 },
              }}
              exit={{ opacity: 0, x: 20 }}
              onClick={togglePanelVisibility}
              className="fixed top-[140px] right-0 z-50 bg-red-600 text-white px-4 py-3 rounded-l-lg shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              whileHover={{ x: -5 }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
              <span className="hidden sm:inline">Módulos</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {showCreateModuleModal && (
          <CreateModuleModal
            courseId={Number(id)}
            onClose={() => setShowCreateModuleModal(false)}
            onSave={handleCreateModule}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModuleModal && selectedModule && (
          <EditModuleModal
            module={selectedModule}
            onClose={() => setShowEditModuleModal(false)}
            onSave={handleEditModule}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModuleModal && selectedModule && (
          <DeleteModuleModal
            module={selectedModule}
            onClose={() => setShowDeleteModuleModal(false)}
            onConfirm={() => handleDeleteModule(selectedModule.ModuleID)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;
