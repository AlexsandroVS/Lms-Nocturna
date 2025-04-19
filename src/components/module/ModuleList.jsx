/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import CreateActivityModal from "../../admin/modals/Activities/CreateActivityModal";
import EditActivityModal from "../../admin/modals/Activities/EditActivityModal";
import DeleteActivityModal from "../../admin/modals/Activities/DeleteActivityModal";

/**
 * ESTE componente:
 * 1. Recibe la lista de módulos.
 * 2. Busca las actividades por cada módulo.
 * 3. Muestra encabezado del módulo, y despliegue de actividades.
 * 4. Cada actividad puede verse en detalle, o editarse/eliminarse si eres admin.
 * 5. Soporta crear una actividad (modal).
 * 6. Llama a onShowActivityDetail(activity) para mostrar el detalle en CoursePage (columna izq).
 */
const ModuleList = ({
  modules,
  color,
  onEditModule = () => {},
  onDeleteModule = () => {},
  onLockModule = () => {},
  // IMPORTANTE: este callback viene desde CoursePage
  // para actualizar `selectedActivity` en el padre.
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
  }, [modules, activitiesByModule, api]);

  // Bloquear / Desbloquear
  const handleLockToggle = async (moduleId, currentLockStatus) => {
    try {
      const newLockStatus = currentLockStatus === 1 ? 0 : 1;
      if (modules.length > 0) {
        await api.put(
          `/courses/${modules[0].CourseID}/modules/${moduleId}`,
          { isLocked: newLockStatus }
        );
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
    if (!selectedModuleId) return;
    const formData = new FormData();
    formData.append("title", newActivity.title);
    formData.append("content", newActivity.content);
    formData.append("type", newActivity.type);
    formData.append("file", newActivity.file);
    formData.append("deadline", newActivity.deadline);

    try {
      await api.post(
        `/courses/${modules[0].CourseID}/modules/${selectedModuleId}/activities`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await fetchActivities(modules[0].CourseID, selectedModuleId);

      setShowCreateModal(false);
      setSelectedModuleId(null);
    } catch (error) {
      console.error("❌ Error al crear la actividad:", error);
    }
  };

  // Editar actividad
  const handleEditActivity = async (updatedActivity) => {
    try {
      const response = await api.put(
        `/activities/${updatedActivity.ActivityID}`,
        updatedActivity
      );
      if (response.data.message === "Actividad actualizada correctamente.") {
        alert("Actividad actualizada correctamente.");
        if (selectedModuleId) {
          await fetchActivities(modules[0].CourseID, selectedModuleId);
        }
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("❌ Error al actualizar la actividad:", error);
      alert("Hubo un error al actualizar la actividad.");
    }
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

  // QUITA el modal de detalles, en su lugar, llama onShowActivityDetail
  const handleShowActivityDetails = (activity) => {
    // En vez de setShowActivityDetailsModal(true), llamamos:
    onShowActivityDetail(activity);
  };

  // Menú por actividad
  const toggleActivityMenu = (activityId, e) => {
    e.stopPropagation();
    setOpenMenuActivityId((prev) => (prev === activityId ? null : activityId));
  };
  const isActivityMenuOpen = (activityId) => openMenuActivityId === activityId;

  return (
    <div className="space-y-4">
      {modules.map((mod) => {
        const totalActivities = activitiesByModule[mod.ModuleID]?.length || 0;
        const isLocked = !!mod.isLocked;
        const isModuleOpen = areActivitiesOpen(mod.ModuleID);

        return (
          <motion.div
            key={mod.ModuleID}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 group relative"
          >
            {/* ENCABEZADO DEL MÓDULO */}
            
              
                <div class="grid grid-cols-6 gap-4 justify-center ">
                  <div class="col-span-4 col-start-1 flex gap-10 content-center  ...">
                    <div class="flex justify-center ...">
                      <div class="h-16 flex-1 ...">
                        {isLocked ? (
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
                      <div class="h-16 w-32 shrink-0  ">

                        <h3 className="text-xl font-semibold truncate text-center">
                          {mod.title}
                        </h3>
                      

                      </div>
                      <div class="h-16 flex-1 ...">
                            <div className="flex items-center text-gray-600">
                              <FontAwesomeIcon icon={faBookOpen} className="mr-2" style={{ color }} />
                              <span className="text-xs">{totalActivities} actividades</span>
                            </div>

                            
                      </div>
                    </div>
                    {currentUser?.role === "admin" && (
                                  <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.50 }}
                                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                  onClick={(e) => toggleModuleMenu(mod.ModuleID, e)}
                                  title="Opciones de Módulo"
                                >
                                  <FontAwesomeIcon icon={faEllipsisVertical} />
                                </motion.button>
                            )}
                  </div>
                  <div class="col-start-1 col-end-3 ..."> 
                    {/* Botón para desplegar/ocultar actividades */}
                    {currentUser?.role === "admin" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            onClick={() => toggleActivities(mod.ModuleID)}
                          >
                            {isModuleOpen ? (
                              <>
                                Ocultar Actividades
                                <FontAwesomeIcon icon={faChevronUp} className="ml-2" />
                              </>
                            ) : (
                              <>
                                Ver Actividades
                                <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                              </>
                            )}
                          </motion.button>
                        )}
                  </div>       
                  <div class="col-span-2 col-end-7 ...">
                        {/* Si eres admin: Botón para crear nueva actividad */}
                        {currentUser?.role === "admin" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-md border border-red-700"
                            onClick={() => {
                              setSelectedModuleId(mod.ModuleID);
                              setShowCreateModal(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="font-semibold">Nueva Actividad</span>
                          </motion.button>
                        )}
                    

                  </div>
                  <div class="col-start-1 col-end-7 flex justify-center ...">
         
                    {currentUser?.role === "student" && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            onClick={() => toggleActivities(mod.ModuleID)}
                          >
                            {isModuleOpen ? (
                              <>
                                Ocultar Actividades
                                <FontAwesomeIcon icon={faChevronUp} className="ml-2" />
                              </>
                            ) : (
                              <>
                                Ver Actividades
                                <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                              </>
                            )}
                          </motion.button>
                        )}

                          

                        {/* Opciones del módulo (editar/eliminar/bloquear) => si quieres menú de 3 puntos para el módulo */}
                        
                    </div>
                  </div>
                
            

            {/* MENÚ DEL MÓDULO (opcional) */}
            {isModuleMenuOpen(mod.ModuleID) && currentUser?.role === "admin" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-gray-50 p-4 rounded-xl shadow-lg border-gray-200"
              >
                <div className="flex flex-col gap-2">
                  <button
                    className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-left"
                    onClick={() => onEditModule(mod)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Editar Módulo
                  </button>

                  <button
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-left"
                    onClick={() => onDeleteModule(mod.ModuleID)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Eliminar Módulo
                  </button>

                  <button
                    className={`p-2 rounded-lg transition-colors text-left ${
                      isLocked
                        ? "bg-red-100 hover:bg-red-200 text-red-600"
                        : "bg-green-100 hover:bg-green-200 text-green-600"
                    }`}
                    onClick={() => handleLockToggle(mod.ModuleID, mod.isLocked)}
                  >
                    <FontAwesomeIcon
                      icon={isLocked ? faLock : faUnlock}
                      className="mr-2"
                    />
                    {isLocked ? "Desbloquear Módulo" : "Bloquear Módulo"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* DESPLIEGUE DE ACTIVIDADES DE ESTE MÓDULO */}
            {isModuleOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white border-l-4 border-red-600 rounded-xl shadow-inner"
              >
                {/* Lista de actividades */}
                {activitiesByModule[mod.ModuleID]?.length > 0 ? (
                  <ul className="space-y-4 p-4">
                    {activitiesByModule[mod.ModuleID].map((activity, idx) => (
                      <li key={activity.ActivityID}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                          className="p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          {/* Contenido de la actividad */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-gray-800">
                                {activity.Title}
                              </h3>
                              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                {activity.Type}
                              </span>
                            </div>
                            {activity.deadline && (
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <span className="font-medium">Fecha límite:</span>
                                <span className="bg-red-50 px-2 py-1 rounded-md text-red-700">
                                  {new Date(activity.deadline).toLocaleDateString()}
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Botones de acción */}
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            {/* Detalles */}
                            <motion.button
                              onClick={() => handleShowActivityDetails(activity)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                            >
                              <span>Detalles</span>
                              <FontAwesomeIcon icon={faArrowRight} />
                            </motion.button>

                            {/* Menú de hamburguesa (solo admin) */}
                            {currentUser?.role === "admin" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                                onClick={(e) => {
                                  // Abrimos/cerramos el menú de esta actividad
                                  toggleActivityMenu(activity.ActivityID, e);
                                  setSelectedActivity(activity);
                                  setSelectedModuleId(mod.ModuleID);
                                }}
                                title="Opciones de la actividad"
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </motion.button>
                            )}
                          </div>
                        </motion.div>

                        {/* Menú colapsable (Editar/Eliminar) */}
                        {currentUser?.role === "admin" && isActivityMenuOpen(activity.ActivityID) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 ml-4 bg-gray-50 rounded-xl shadow-lg border-gray-200 p-4"
                          >
                            <div className="flex flex-col gap-2">
                              {/* Botón Editar */}
                              <button
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  setShowEditModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                                <span>Editar</span>
                              </button>

                              {/* Botón Eliminar */}
                              <button
                                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 flex items-center gap-2 transition-colors"
                                onClick={() => {
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Eliminar</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 bg-white text-center text-gray-500">
                    No hay actividades disponibles en este módulo
                  </div>
                )}
              </motion.div>
            )}
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
