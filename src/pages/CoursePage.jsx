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

const CoursePage = () => {
  const { api } = useAuth();
  const { id } = useParams();

  // Estados para curso, módulos y modales
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [showDeleteModuleModal, setShowDeleteModuleModal] = useState(false);

  // Función reutilizable para cargar módulos
  const fetchModules = useCallback(async () => {
    try {
      const modulesResp = await api.get(`/courses/${id}/modules`);
      console.log("Módulos obtenidos:", modulesResp.data); // Aquí revisa si los datos ahora incluyen todos los campos
  
      setModules(
        modulesResp.data?.map((m) => ({
          ...m,
          activities: m.activities || [], // Asegura que activities siempre exista
        })) || []
      );
    } catch (err) {
      console.error("Error al cargar módulos:", err);
      setModules([]); // Resetear a array vacío
    }
  }, [api, id]);
  
  // Cargar datos del curso y módulos al montar
  useEffect(() => {
    console.log("Curso ID:", id); // Verifica si el id está correctamente capturado
  
    const controller = new AbortController();
  
    const fetchData = async () => {
      try {
        const [courseResp, modulesResp] = await Promise.all([
          api.get(`/courses/${id}`, { signal: controller.signal }),
          api.get(`/courses/${id}/modules`, { signal: controller.signal }),
        ]);
  
        setCourse(courseResp.data);
        setModules(modulesResp.data);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Error al cargar curso o módulos:", err);
        }
      }
    };
  
    fetchData();
    return () => controller.abort();
  }, [id, api]);
  

  // Crear nuevo módulo
  const handleCreateModule = useCallback(
    async (moduleData) => {
      try {
        await api.post(`/courses/${id}/modules`, moduleData);
        await fetchModules(); // Actualizar la lista después de crear
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
          `/courses/${id}/modules/${selectedModule.ModuleID}`, // ✅ URL correcta
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

  // Eliminar módulo
  const handleDeleteModule = useCallback(
    async (moduleId) => {
      if (!moduleId) return;

      try {
        await api.delete(`/courses/${id}/modules/${moduleId}`); // ✅ URL directa
        await fetchModules();
        setShowDeleteModuleModal(false);
      } catch (err) {
        console.error("Error al eliminar módulo:", err);
      }
    },
    [api, id, fetchModules]
  );

  // Memoizar cálculos de progreso
  const courseWithProgress = useMemo(() => {
    return course ? calculateCourseProgress({ ...course, modules }) : null;
  }, [course, modules]);

  // Memoizar componentes hijos
  const MemoizedModuleList = useMemo(() => {
    return (
      <ModuleList
        modules={modules}
        color={courseWithProgress?.color}
        onEditModule={(module) => {
          setSelectedModule(module);
          setShowEditModuleModal(true);
        }}
        onDeleteModule={(moduleId) => {
          setSelectedModule(modules.find((m) => m.ModuleID === moduleId));
          setShowDeleteModuleModal(true);
        }}
      />
    );
  }, [modules, courseWithProgress?.color]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-8"
    >
      {courseWithProgress && (
        <CourseHeader
          course={courseWithProgress}
          color={courseWithProgress.color}
          title={course.title}
        />
      )}

      {/* Botón para crear módulo */}
      <div className="mb-4 flex justify-end">
        <button
          className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2"
          onClick={() => setShowCreateModuleModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Crear Módulo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold mb-6 flex items-center"
          >
            {courseWithProgress && (
              <FontAwesomeIcon
                icon={courseWithProgress.icon}
                className="mr-3 text-3xl transition-transform hover:scale-110"
                style={{ color: courseWithProgress.color }}
              />
            )}
            Módulos del Curso
          </motion.h2>

          {MemoizedModuleList}
        </div>

        {courseWithProgress && (
          <ProgressSidebar
            course={courseWithProgress}
            color={courseWithProgress.color}
          />
        )}
      </div>

      {/* Modal para crear módulo */}
      {showCreateModuleModal && (
        <CreateModuleModal
          courseId={Number(id)}
          onClose={() => setShowCreateModuleModal(false)}
          onSave={handleCreateModule}
        />
      )}

      {/* Modal para editar módulo */}
      {showEditModuleModal && selectedModule && (
        <EditModuleModal
          module={selectedModule}
          onClose={() => setShowEditModuleModal(false)}
          onSave={handleEditModule}
        />
      )}

      {/* Modal para eliminar módulo */}
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
