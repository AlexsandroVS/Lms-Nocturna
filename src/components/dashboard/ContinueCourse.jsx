import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import courses from "../../data/courses";

export default function ContinueCourse() {
  // Función para encontrar la actividad más próxima a vencer
  const findNextActivity = () => {
    let nextActivity = null;
    let closestDeadline = Infinity;

    // Recorre todos los cursos y actividades
    courses.forEach((course) => {
      course.modules.forEach((module) => {
        module.activities.forEach((activity) => {
          if (!activity.completed) {
            const deadline = new Date(activity.deadline).getTime();
            if (deadline < closestDeadline) {
              closestDeadline = deadline;
              nextActivity = { ...activity, course };
            }
          }
        });
      });
    });

    return nextActivity;
  };

  const nextActivity = findNextActivity();

  if (!nextActivity) {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl"
      >
        <h2 className="font-semibold text-xl text-[#003049] mb-4">
          No hay actividades pendientes
        </h2>
        <p className="text-gray-600">
          ¡Felicidades! Has completado todas las actividades.
        </p>
      </motion.div>
    );
  }

  const { course, title, deadline } = nextActivity;
  const deadlineDate = new Date(deadline).toLocaleDateString();
  const deadlineTime = new Date(deadline).toLocaleTimeString();

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl"
    >
      <div className="flex flex-wrap justify-between mb-4">
        <h2 className="font-semibold text-xl text-[#003049]">
          Continúa donde lo dejaste
        </h2>
        <span className="text-md font-semibold" style={{ color: course.color }}>
          {course.title} - {title}
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div
          className="w-24 h-24 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${course.color}20` }}
        >
          <FontAwesomeIcon
            icon={course.icon}
            className="text-4xl"
            style={{ color: course.color }}
          />
        </div>
        <div className="flex-1 w-full">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${course.progress}%`,
                backgroundColor: course.color,
              }}
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600">
                Fecha límite: {deadlineDate} a las {deadlineTime}
              </p>
            </div>
            <button
              className="text-lg font-bold text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: course.color }}
            >
              Continuar Lección{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
