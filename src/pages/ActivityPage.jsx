import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CreateActivityModal from "../admin/modals/Activities/CreateActivityModal";
import EditActivityModal from "../admin/modals/Activities/EditActivityModal";
import DeleteActivityModal from "../admin/modals/Activities/DeleteActivityModal";
import ActivityDetailsModal from "../admin/modals/Activities/ActivityDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const ActivityPage = () => {
  const { api, currentUser } = useAuth();
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivityDetailsModal, setShowActivityDetailsModal] =
    useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Cargar módulo y actividades
  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Parámetros inválidos en la URL");
      setLoading(false);
      return;
    }

    const fetchModuleAndActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Solicitar los datos del módulo
        const moduleResp = await api.get(
          `/courses/${courseId}/modules/${moduleId}`
        );

        // Solicitar las actividades del módulo
        const activitiesResp = await api.get(
          `/courses/${courseId}/modules/${moduleId}/activities`
        );

        // Actualizar estado con los datos obtenidos
        setModule(moduleResp.data);
        setActivities(activitiesResp.data); // activitiesResp.data será [] si no hay actividades
      } catch (error) {
        console.error("❌ Error al obtener el módulo o actividades:", error);
        setError("No se pudo cargar la información del módulo.");
      } finally {
        setLoading(false);
      }
    };

    fetchModuleAndActivities();
  }, [api, courseId, moduleId]);

  // Crear actividad
  const handleCreateActivity = async (newActivity) => {
    const formData = new FormData();
    formData.append("title", newActivity.title);
    formData.append("content", newActivity.content);
    formData.append("type", newActivity.type);
    formData.append("file", newActivity.file); // Asegúrate de que el archivo está siendo añadido
    formData.append("deadline", newActivity.deadline);


    try {
      const response = await api.post(
        `/courses/${courseId}/modules/${moduleId}/activities`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Respuesta del backend:", response.data); // Verificar la respuesta

      if (response.data.activity) {
        // Actualizar las actividades con la respuesta después de crearla
        setActivities((prevActivities) => [
          ...prevActivities,
          response.data.activity,
        ]);
        setShowCreateModal(false);

        // Hacer un llamado adicional para obtener las actividades actualizadas
        const activitiesResp = await api.get(
          `/courses/${courseId}/modules/${moduleId}/activities`
        );
        setActivities(activitiesResp.data);
      }
    } catch (error) {
      console.error(
        "❌ Error al crear la actividad:",
        error.response?.data || error
      );
    }
  };

  const handleEditActivity = async (updatedActivity) => {
    try {
      // Enviar la actualización al servidor
      const response = await api.put(
        `/activities/${updatedActivity.ActivityID}`,
        updatedActivity
      );
  
      if (response.data.message === "Actividad actualizada correctamente.") {
        // Recargar la página para obtener los datos actualizados
        alert("Actividad actualizada correctamente.");
        window.location.reload(); // Forzar la recarga de la página
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

      // Actualizar la lista de actividades eliminando la actividad eliminada
      setActivities((prevActivities) =>
        prevActivities.filter((act) => act.ActivityID !== activityId)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("❌ Error al eliminar la actividad:", error);
    }
  };

  const handleShowActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setShowActivityDetailsModal(true);
  };

  // Manejo de estados de carga y errores
  if (loading)
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Cargando módulo...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-xl text-red-500">{error}</div>
    );

    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 to-amber-700 bg-clip-text text-transparent">
            {module?.Title}
          </h1>
          
          {currentUser?.role === "admin" && (
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-md border border-red-700"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="font-semibold">Nueva Actividad</span>
            </motion.button>
          )}
        </div>
    
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-l-4 border-red-600 pl-3">
          Actividades del Módulo
        </h2>
    
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 bg-white rounded-2xl shadow-lg text-center border-2 border-dashed border-red-100"
          >
            <p className="text-gray-600 text-lg font-medium">
              No hay actividades disponibles en este módulo
            </p>
          </motion.div>
        ) : (
          <motion.ul className="space-y-4">
            {activities.map((activity, index) => (
              <motion.li
                key={activity.ActivityID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="group relative"
              >
                <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-red-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">
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
    
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <motion.button
                      onClick={() => handleShowActivityDetails(activity)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Detalles</span>
                      <FontAwesomeIcon icon={faArrowRight} />
                    </motion.button>
    
                    {currentUser?.role === "admin" && (
                      <>
                        <motion.button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowEditModal(true);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2 transition-colors"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          <span>Editar</span>
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowDeleteModal(true);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 flex items-center justify-center gap-2 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          <span>Eliminar</span>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
    
        {/* Modales (mantener igual) */}
        {showCreateModal && (
          <CreateActivityModal
            onClose={() => setShowCreateModal(false)}
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
        {showActivityDetailsModal && selectedActivity && (
          <ActivityDetailsModal
            activity={selectedActivity}
            onClose={() => setShowActivityDetailsModal(false)}
          />
        )}
      </div>
    );
};

export default ActivityPage;
