import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CreateActivityModal from "../admin/modals/Activities/CreateActivityModal";
import EditActivityModal from "../admin/modals/Activities/EditActivityModal";
import DeleteActivityModal from "../admin/modals/Activities/DeleteActivityModal";
import ActivityDetailsModal from "../admin/modals/Activities/ActivityDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ActivityPage = () => {
  const { api, currentUser } = useAuth();
  const { courseId, moduleId } = useParams(); // Captura los parámetros de la URL
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

        // Solicitar los datos del módulo y actividades
        const [moduleResp, activitiesResp] = await Promise.all([
          api.get(`/courses/${courseId}/modules/${moduleId}`),
          api.get(`/courses/${courseId}/modules/${moduleId}/activities`),
        ]);

        // Actualizar estado con los datos obtenidos
        setModule(moduleResp.data);
        setActivities(activitiesResp.data);
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
    formData.append("file", newActivity.file); // Aquí enviamos el archivo
    formData.append("deadline", newActivity.deadline);
    try {
      const response = await api.post(
        `/courses/${courseId}/modules/${moduleId}/activities`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Actualizar el estado con la nueva actividad
      setActivities((prevActivities) => [
        ...prevActivities,
        response.data.activity,
      ]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("❌ Error al crear la actividad:", error);
    }
  };

  // Editar actividad
  const handleEditActivity = async (updatedActivity) => {
    try {
      await api.put(
        `/activities/${updatedActivity.ActivityID}`,
        updatedActivity
      );

      // Actualizar la actividad en la lista
      setActivities(
        activities.map((act) =>
          act.ActivityID === updatedActivity.ActivityID ? updatedActivity : act
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("❌ Error al actualizar la actividad:", error);
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Agregar Actividad
        </button>
      )}

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Actividades:</h2>

      {activities.length === 0 ? (
        <p className="text-gray-500 italic">
          No hay actividades registradas en este módulo.
        </p>
      ) : (
        <ul className="space-y-6">
          {activities.map((activity) => (
            <li
              key={activity.ActivityID}
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
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowEditModal(true);
                      }}
                      className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowDeleteModal(true);
                      }}
                      className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleShowActivityDetails(activity)}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ver Detalles
                </button>
              </div>
            </li>
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
