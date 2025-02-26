import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CreateActivityModal from "../admin/modals/Activities/CreateActivityModal";
import EditActivityModal from "../admin/modals/Activities/EditActivityModal";
import DeleteActivityModal from "../admin/modals/Activities/DeleteActivityModal";
import ActivityDetailsModal from "../admin/modals/Activities/ActivityDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
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

    // Verificar los datos antes de enviarlos
    console.log("Datos a enviar:", formData);

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
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{module?.Title}</h1>

      {currentUser?.role === "admin" && (
        <motion.button
          onClick={() => setShowCreateModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Agregar Actividad
        </motion.button>
      )}

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Actividades:
      </h2>

      {activities.length === 0 ? (
        <div className="p-6 bg-white shadow-xl rounded-lg text-center">
          <p className="text-gray-500 italic">
            No hay actividades registradas en este módulo.
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {activities.map((activity) => (
            <motion.li
              key={activity.ActivityID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-white shadow-xl rounded-lg flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {activity.Title}
                </h3>
                <p className="text-gray-600 text-lg">{activity.Type}</p>
              </div>

              <div className="flex gap-4">
                {currentUser?.role === "admin" && (
                  <>
                    <motion.button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowEditModal(true);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowDeleteModal(true);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </>
                )}

                <motion.button
                  onClick={() => handleShowActivityDetails(activity)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ver Detalles
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Modales */}
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
