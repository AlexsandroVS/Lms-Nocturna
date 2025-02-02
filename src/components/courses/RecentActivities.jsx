// components/dashboard/RecentActivities.jsx
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faBookOpen,
  faVideo,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import courses from "../../data/courses";

// Función para obtener actividades aleatorias
const getRandomActivities = (count = 3) => {
  const allActivities = courses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.activities.map((activity) => ({ ...activity, course }))
    )
  );

  // Filtrar actividades completadas y ordenar por fecha
  const filteredActivities = allActivities
    .filter((activity) => activity.completed)
    .sort((a, b) => new Date(b.deadline) - new Date(a.deadline));

  // Seleccionar las primeras "count" actividades
  return filteredActivities.slice(0, count);
};

export default function RecentActivities() {
  const activities = getRandomActivities(3);

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Últimas Actividades Vistas
        </h3>
        <p className="text-gray-500">No hay actividades recientes.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl h-[340px] overflow-y-auto shadow-lg"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Últimas Actividades Vistas
      </h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              className="w-10 h-10 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: `${activity.course.color}20` }}
            >
              <FontAwesomeIcon
                icon={
                  activity.type === "video"
                    ? faVideo
                    : activity.type === "pdf"
                    ? faFilePdf
                    : faBookOpen
                }
                className="text-lg"
                style={{ color: activity.course.color }}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{activity.title}</h4>
              <p className="text-sm text-gray-500">
                {activity.course.title} - {activity.type}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                Visto el {new Date(activity.deadline).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
