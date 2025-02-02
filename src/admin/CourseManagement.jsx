import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  itemVariantsCourse,
  containerVariantsCourse,
} from "../utils/animationUtils";
import {
  faBook,
  faArchive,
  faPencilAlt,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import courses from "../data/courses";

export default function CourseManagement() {
  const toggleCourseStatus = (courseId) => {
    console.log(`Cambiando estado del curso ${courseId}`);
  };
  const adjustColorLightness = (hex, amount) => {
    // Convierte el color hexadecimal a RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    // Ajusta la luminosidad
    r = Math.min(255, Math.max(0, r + amount));
    g = Math.min(255, Math.max(0, g + amount));
    b = Math.min(255, Math.max(0, b + amount));

    // Convierte de nuevo a hexadecimal
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-2xl  border border-gray-100 p-6"
      style={{ height: "600px" }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Gestión de Cursos
        </motion.h2>
        <FontAwesomeIcon icon={faRocket} className="text-indigo-500 text-xl" />
      </div>

      <motion.div
        variants={containerVariantsCourse}
        initial="hidden"
        animate="visible"
        className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-custom  pr-2"
      >
        <AnimatePresence>
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariantsCourse}
              whileHover="hover"
              className="group mb-3  p-4 bg-white rounded-lg border-2 border-gray-50 hover:border-indigo-50 transition-all"
            >
              <div className="flex flex-col md:flex-row items-start justify-between">
                {/* Información del curso */}
                <div className="flex items-start space-x-4 flex-1">
                  <motion.div
                    whileHover={{ rotate: -5 }}
                    className="w-12 h-12 flex items-center justify-center rounded-lg shadow-sm"
                    style={{ backgroundColor: course.color }}
                  >
                    <FontAwesomeIcon
                      icon={course.icon}
                      className="text-white text-xl transform group-hover:scale-110 transition-transform"
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        {course.duration}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        {course.modules.length} módulos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones y estado */}
                <div className="flex items-center gap-3 mt-4 md:mt-0 md:pl-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                        course.status === "active"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={course.status === "active" ? faBook : faArchive}
                        className="text-xs"
                      />
                      {course.status === "active" ? "Publicado" : "Borrador"}
                    </span>
                  </motion.div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCourseStatus(course.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      {course.status === "active" ? "Archivar" : "Publicar"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Barra de progreso animada */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                className="mt-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Progreso general
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="h-full rounded-full"
                    style={{
                      backgroundImage: `linear-gradient(
                        135deg,
                        ${course.color},
                        ${adjustColorLightness(course.color, 50)}
                      )`,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
