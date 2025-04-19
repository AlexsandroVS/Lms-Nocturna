import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import CourseHeader from "../components/courses/CourseHeader";
import ModuleList from "../components/module/ModuleList";
import ProgressSidebar from "../components/courses/ProgressSidebar";
import { calculateCourseProgress } from "../utils/courseUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { CreateModuleModal } from "../admin/modals/CreateModuleModal";
import EditModuleModal from "../admin/modals/Modules/EditModuleModal";
import DeleteModuleModal from "../admin/modals/Modules/DeleteModuleModal";

// Importa tu componente de detalles de actividad en panel:
import ActivityDetailsPanel from "../admin/modals/Activities/ActivityDetailsModal";

const CoursePage = () => {
  const { api, currentUser } = useAuth();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);

  // NUEVO: actividad seleccionada para mostrar detalles en la columna izquierda
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false);
  const [averages, setAverages] = useState(null);

  // Función para obtener los promedios
  const fetchAverages = useCallback(async () => {
    try {
      const userId = currentUser?.id;
      if (!userId) return;
      const response = await api.get(
        `/grades/user/${userId}/course/${id}/averages`
      );
      setAverages(response.data.data); // Guardar solo la data del response
    } catch (err) {
      console.error("Error al obtener los promedios:", err);
    }
  }, [api, currentUser?.id, id]);

  // Función para cargar módulos
  const fetchModules = useCallback(async () => {
    try {
      const modulesResp = await api.get(`/courses/${id}/modules`);
      const modulesWithActivities = modulesResp.data?.map((module) => ({
        ...module,
        totalActivities: module.activities ? module.activities.length : 0,
      }));

      console.log(currentUser.role);
      // Filtrar módulos según el rol del usuario
      if (currentUser?.role !== "admin") {
        // Filtrar solo los módulos no bloqueados
        setModules(modulesWithActivities.filter((m) => m.isLocked === 0));
      } else {
        // Admin ve todos los módulos
        setModules(modulesWithActivities);
      }
    } catch (err) {
      console.error("Error al cargar módulos:", err);
      setModules([]);
    }
  }, [api, id, currentUser.role]);

  // Cargar datos del curso, módulos y promedios al montar
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const [courseResp, modulesResp] = await Promise.all([
          api.get(`/courses/${id}`, { signal: controller.signal }),
          api.get(`/courses/${id}/modules`, { signal: controller.signal }),
        ]);
        setCourse(courseResp.data);
        fetchModules(); // Carga y filtra módulos
        fetchAverages(); // Obtener promedios
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error al cargar curso o módulos:", err);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [id, api, fetchModules, fetchAverages]);

  // Convertir calificación a porcentaje
  const convertToPercentage = (score) => {
    if (score === "N/A") return score;
    return ((score / 20) * 100).toFixed(0);
  };

  // Crear módulo
  const handleCreateModule = useCallback(
    async (moduleData) => {
      try {
        await api.post(`/courses/${id}/modules`, moduleData);
        await fetchModules();
        setShowCreateModuleModal(false);
      } catch (err) {
        console.error("Error al crear módulo:", err);
      }
    },
    [api, id, fetchModules]
  );

  // Editar módulo
  const handleEditModule = useCallback(
    async (moduleData) => {
      if (!selectedModule?.ModuleID) return;

      try {
        await api.put(
          `/courses/${id}/modules/${selectedModule.ModuleID}`,
          moduleData
        );
        await fetchModules();
        setShowEditModuleModal(false);
      } catch (err) {
        console.error("Error al editar módulo:", err);
      }
    },
    [api, id, selectedModule, fetchModules]
  );

  // Bloqueo/desbloqueo en memoria
  const handleLockModule = useCallback((moduleId, newStatus) => {
    setModules((prev) =>
      prev.map((m) =>
        m.ModuleID === moduleId ? { ...m, isLocked: newStatus } : m
      )
    );
  }, []);

  // Eliminar módulo
  const handleDeleteModule = useCallback(
    async (moduleId) => {
      if (!moduleId) return;
      try {
        await api.delete(`/courses/${id}/modules/${moduleId}`);
        await fetchModules();
        setShowDeleteModuleModal(false);
      } catch (err) {
        console.error("Error al eliminar módulo:", err);
      }
    },
    [api, id, fetchModules]
  );

  // Calcular progreso
  const courseWithProgress = useMemo(() => {
    return course ? calculateCourseProgress({ ...course, modules }) : null;
  }, [course, modules]);

  const courseColor = courseWithProgress?.color;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7l mx-auto p-1"
    >
      {/* Header del curso */}
      {courseWithProgress && (
        <CourseHeader
          course={courseWithProgress}
          color={courseColor}
          title={course.title}
          courseAverage={convertToPercentage(averages?.courseAverage)}
        />
      )}

      {/* Botón para crear módulo (solo admin) */}
      {currentUser?.role === "admin" && (
        <div className="mb-4 flex justify-end">
          <button
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
            onClick={() => setShowCreateModuleModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Crear Módulo
          </button>
        </div>
      )}

      <div className="flex flex-row gap-4">
        {/* Columna Izquierda: Detalles de la actividad */}
        <div className="basis-2/3">
          {selectedActivity ? (
            <ActivityDetailsPanel
              activity={selectedActivity}
              courseId={id}
              moduleId={selectedActivity?.ModuleID}
            />
          ) : (
            <div className="p-4 bg-white text-gray-500 rounded-xl shadow">
              Selecciona una actividad para ver sus detalles
            </div>
          )}
        </div>

        {/* Columna Derecha: Lista de módulos y actividades */}
        <div className="basis-1/3">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold mb-6 flex justify-center"
          >
            Módulos del Curso
          </motion.h2>

          <ModuleList
            modules={modules}
            color={courseColor}
            onLockModule={handleLockModule}
            onEditModule={(module) => {
              setSelectedModule(module);
              setShowEditModuleModal(true);
            }}
            onDeleteModule={(moduleId) => {
              const foundModule = modules.find((m) => m.ModuleID === moduleId);
              setSelectedModule(foundModule);
              setShowDeleteModuleModal(true);
            }}
            // IMPORTANTE: callback para mostrar detalles en la izquierda
            onShowActivityDetail={(activity) => setSelectedActivity(activity)}
          />
        </div>
      </div>

      {/* Modales de crear/editar/eliminar módulo */}
      {showCreateModuleModal && (
        <CreateModuleModal
          courseId={Number(id)}
          onClose={() => setShowCreateModuleModal(false)}
          onSave={handleCreateModule}
        />
      )}
      {showEditModuleModal && selectedModule && (
        <EditModuleModal
          module={selectedModule}
          onClose={() => setShowEditModuleModal(false)}
          onSave={handleEditModule}
        />
      )}
      {showDeleteModuleModal && selectedModule && (
        <DeleteModuleModal
          module={selectedModule}
          onClose={() => setShowDeleteModuleModal(false)}
          onConfirm={() => handleDeleteModule(selectedModule.ModuleID)}
        />
      )}
    </motion.div>
  );
};

export default CoursePage;
