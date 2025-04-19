import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext"; // Para obtener el currentUser y api
import { useNavigate } from "react-router-dom";

export default function ContinueCourse() {
  const { api, currentUser } = useAuth(); // Obtener el currentUser y api desde useAuth
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const coursesResponse = await api.get(`/courses/user/${currentUser.id}`);
        const coursesData = coursesResponse.data;

        const activitiesPromises = coursesData.map(async (course) => {
          const modulesResponse = await api.get(`/courses/${course.id}/modules`);
          const modulesData = modulesResponse.data;

          const activitiesPromises = modulesData.map(async (module) => {
            const activitiesResponse = await api.get(
              `/courses/${course.id}/modules/${module.id}/activities`
            );
            const activitiesData = activitiesResponse.data;

            return activitiesData.map((activity) => ({
              ...activity,
              courseId: course.id,
              courseTitle: course.title,
              moduleId: module.id,
              moduleTitle: module.title,
            }));
          });

          const allActivities = await Promise.all(activitiesPromises);
          return allActivities.flat();
        });

        const allActivities = await Promise.all(activitiesPromises);
        const flattenedActivities = allActivities.flat();

        const sortedActivities = flattenedActivities
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 4); // Las 4 actividades más cercanas

        setRecentActivities(sortedActivities);
      } catch (err) {
        console.error("Error al obtener actividades:", err);
      }
    };

    fetchRecentActivities();
  }, [api, currentUser.id]);

  const formatDate = (deadline) => {
    const deadlineDate = new Date(deadline);
    return deadlineDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleActivityClick = (courseId, moduleId) => {
    navigate(`/courses/${courseId}?module=${moduleId}`);
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl"
    >
      <h2 className="font-semibold mb-4 text-xl text-[#003049]">📅 Actividades Recientes</h2>
      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-gray-600">No tienes actividades recientes.</p>
        ) : (
          recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              onClick={() =>
                handleActivityClick(activity.courseId, activity.moduleId)
              }
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${activity.courseColor}20` }}
                >
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="text-2xl"
                    style={{ color: activity.courseColor }}
                  />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.courseTitle} - {activity.moduleTitle}</p>
                  <p className="text-xs text-gray-400">{formatDate(activity.deadline)}</p>
                </div>
              </div>
              <FontAwesomeIcon icon={faArrowRight} className="text-gray-600" />
            </motion.div>
          ))
        )}
      </div>
      <div className="mt-6">
        <motion.button
          className="w-full py-3 bg-red-400 hover:bg-red-500 transition px-6 rounded-lg text-white font-medium"
      
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/courses")}
        >
          Ver todos los cursos
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
}
