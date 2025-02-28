/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faArrowRight,
  faEdit,
  faTrash,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ModuleList = ({
  modules,
  color,
  onEditModule = () => {},
  onDeleteModule = () => {},
  onLockModule = () => {},
}) => {
  const { currentUser, api } = useAuth();
  const navigate = useNavigate();

  // Estado para actividades
  const [activities, setActivities] = useState({});

  // Función para obtener las actividades del módulo
  const fetchActivities = async (courseId, moduleId) => {
    try {
      const response = await api.get(
        `/courses/${courseId}/modules/${moduleId}/activities`
      );
      setActivities((prev) => ({
        ...prev,
        [moduleId]: response.data, // Guardamos las actividades de cada módulo
      }));
    } catch (err) {
      console.error("Error al obtener actividades:", err);
    }
  };

  // Obtener actividades cuando el módulo cambia
  useEffect(() => {
    modules.forEach((module) => {
      if (!activities[module.ModuleID]) {
        fetchActivities(module.CourseID, module.ModuleID);
      }
    });
  }, [modules, activities, api]);

  const handleLockToggle = async (moduleId, currentLockStatus) => {
    try {
      const newLockStatus = currentLockStatus === 1 ? 0 : 1;

      // Actualizar primero en el backend
      await api.put(`/courses/${modules[0].CourseID}/modules/${moduleId}`, {
        isLocked: newLockStatus,
      });

      // Luego notificar al componente padre para actualizar el estado
      onLockModule(moduleId, newLockStatus);
    } catch (err) {
      console.error("Error al cambiar el estado de bloqueo:", err);
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const totalActivities = activities[module.ModuleID]?.length || 0;

        return (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 group relative"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Contenido izquierdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold truncate">
                    {module.title}
                  </h3>
                  {module.isLocked ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full flex items-center gap-1">
                      <FontAwesomeIcon icon={faLock} className="text-xs" />
                      <span>Bloqueado</span>
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                      <FontAwesomeIcon icon={faUnlock} className="text-xs" />
                      <span>Disponible</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-600">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="mr-2"
                    style={{ color }}
                  />
                  <span className="text-sm">{totalActivities} actividades</span>
                </div>
              </div>

              {/* Contenedor de botones */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* Botón principal */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    navigate(
                      `/courses/${module.CourseID}/modules/${module.ModuleID}`
                    )
                  }
                >
                  <span>Ver módulo</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </motion.button>

                {/* Botones de administración */}
                {currentUser?.role === "admin" && (
                  <div className="flex gap-2">
                    {/* Grupo de acciones secundarias */}
                    <div className="flex border-l border-gray-200 pl-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditModule(module);
                        }}
                        title="Editar módulo"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-red-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteModule(module.ModuleID);
                        }}
                        title="Eliminar módulo"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-lg ${
                          module.isLocked
                            ? "bg-red-100 hover:bg-red-200 text-red-600"
                            : "bg-green-100 hover:bg-green-200 text-green-600"
                        } transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLockToggle(module.ModuleID, module.isLocked);
                        }}
                        title={
                          module.isLocked
                            ? "Desbloquear módulo"
                            : "Bloquear módulo"
                        }
                      >
                        <FontAwesomeIcon
                          icon={module.isLocked ? faLock : faUnlock}
                          className="transition-transform"
                        />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ModuleList;
