import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import courses from "../../data/courses"; // Ajusta la ruta

export default function CriticalDeadlines() {
  const navigate = useNavigate(); // Hook para la navegación

  // Función para obtener las actividades próximas a vencer
  const getUpcomingActivities = () => {
    const allActivities = courses.flatMap((course) =>
      course.modules.flatMap((module) =>
        module.activities.map((activity) => ({
          ...activity,
          courseId: course.id, // Agregar el ID del curso
          moduleId: module.id, // Agregar el ID del módulo
          courseTitle: course.title,
          moduleTitle: module.title,
        }))
      )
    );

    // Ordenar por fecha más próxima
    return allActivities
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);
  };

  // Función para determinar el color del borde
  const getBorderColor = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) return "#d62828"; // Rojo
    if (daysDiff <= 3) return "#fcbf49"; // Amarillo
    return "#00C951"; // Verde
  };

  // Función para formatear la fecha
  const formatDate = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();

    if (deadlineDate.toDateString() === today.toDateString()) {
      return (
        "Hoy " +
        deadlineDate.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    return deadlineDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para manejar el clic en una actividad
  const handleActivityClick = (courseId, moduleId) => {
    navigate(`/courses/${courseId}?module=${moduleId}`); // Redirigir a la página del curso con el módulo como parámetro
  };

  const upcomingActivities = getUpcomingActivities();

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl h-[340px] flex flex-col"
    >
      <h2 className="font-semibold mb-4 text-xl text-[#003049]">
        📅 Plazos Críticos
      </h2>
      <div className="flex-1 overflow-auto scrollbar-custom">
        <div className="space-y-4 pr-2">
          {upcomingActivities.map((activity, index) => (
            <div
              key={index}
              className="border-l-4 pl-4 relative cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              style={{ borderColor: getBorderColor(activity.deadline) }}
              onClick={() =>
                handleActivityClick(activity.courseId, activity.moduleId)
              } // Manejar el clic
            >
              <p className="text-lg font-medium truncate">{activity.title}</p>
              <p className="text-sm text-gray-500 truncate">
                {activity.courseTitle} • {activity.moduleTitle}
              </p>
              <p className="text-sm mt-1">
                {formatDate(activity.deadline)}
                <span className="ml-2">
                  {getBorderColor(activity.deadline) === "#d62828"
                    ? "🔥"
                    : getBorderColor(activity.deadline) === "#fcbf49"
                    ? "⏳"
                    : "✅"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
