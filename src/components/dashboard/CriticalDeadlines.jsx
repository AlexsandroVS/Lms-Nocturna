import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CriticalDeadlines() {
  const { api, currentUser } = useAuth();
  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Obtener todos los cursos
        const coursesResponse = await api.get("/courses");
        const courses = coursesResponse.data;
        console.log (courses);
        // Obtener módulos y actividades en paralelo
        const activitiesPromises = courses.flatMap(async (course) => {
          const modulesResponse = await api.get(`/courses/${course.id}/modules`);
          const modules = modulesResponse.data;
          console.log (modules);

          const moduleActivities = await Promise.all(
            modules.map(async (module) => {
              try {
                const { data: activities } = await api.get(
                  `/courses/${course.id}/modules/${module.ModuleID}/activities`
                );
                
                // Mapear la estructura correcta de actividades
                return activities.map(activity => ({
                  id: activity.ActivityID,
                  title: activity.Title,
                  deadline: activity.Deadline,
                  courseId: course.id,
                  courseTitle: course.title,
                  moduleId: module.id,
                  moduleTitle: module.title,
                }));
              } catch (error) {
                console.error(`Error en módulo ${module.id}:`, error);
                return [];
              }
            })
          );

          return moduleActivities.flat();
        });

        const allActivities = (await Promise.all(activitiesPromises)).flat();
        
        const sorted = allActivities
          .filter(a => a.deadline)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 4);

        setUpcomingActivities(sorted);
      } catch (error) {
        console.error("Error general:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [api]);
  // Función para determinar el color del borde
  const getBorderColor = (deadline) => {
    const daysDiff = Math.ceil((new Date(deadline) - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) return "#d62828";
    if (daysDiff <= 3) return "#fcbf49";
    return "#00C951";
  };

  // Función para formatear la fecha (optimizada)
  const formatDate = (deadline) => {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      ...(new Date(deadline).toDateString() !== new Date().toDateString() && {
        day: 'numeric',
        month: 'short'
      })
    };
    
    return new Date(deadline).toLocaleDateString("es-ES", options)
      .replace(/,/, '');
  };

  const handleActivityClick = (courseId, moduleId) => {
    navigate(`/courses/${courseId}?module=${moduleId}`);
  };

  if (loading) return <div>Cargando plazos críticos...</div>;

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl h-[340px] flex flex-col"
    >
      <h2 className="font-semibold mb-4 text-xl text-[#003049]">
        📅 Plazos Críticos
      </h2>
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 pr-2">
          {upcomingActivities.map((activity) => (
            <div
              key={`${activity.courseId}-${activity.moduleId}-${activity.id}`}
              className="border-l-4 pl-4 relative cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              style={{ borderColor: getBorderColor(activity.deadline) }}
              onClick={() => handleActivityClick(activity.courseId, activity.moduleId)}
            >
              <p className="text-lg font-medium truncate">{activity.title}</p>
              <p className="text-sm text-gray-500 truncate">
                {activity.courseTitle} • {activity.moduleTitle}
              </p>
              <p className="text-sm mt-1">
                {formatDate(activity.deadline)}
                <span className="ml-2">
                  {{
                    "#d62828": "🔥",
                    "#fcbf49": "⏳",
                    "#00C951": "✅"
                  }[getBorderColor(activity.deadline)]}
                </span>
              </p>
            </div>
          ))}
          {!upcomingActivities.length && (
            <p className="text-gray-500">No hay plazos próximos</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}