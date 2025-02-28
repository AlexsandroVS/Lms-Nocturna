import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faArchive,
  faRocket,
  faGraduationCap,
  faChalkboardTeacher,
  faRobot,
  faMicrochip,
  faBolt,
  faToolbox,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Para redirigir al curso

// Opciones de íconos para los cursos
const ICON_OPTIONS = [
  { value: "book-open", icon: faBook },
  { value: "chalkboard-teacher", icon: faChalkboardTeacher },
  { value: "laptop-code", icon: faLaptopCode },
  { value: "graduation-cap", icon: faGraduationCap },
  { value: "bolt", icon: faBolt },
  { value: "robot", icon: faRobot },
  { value: "microchip", icon: faMicrochip },
  { value: "toolbox", icon: faToolbox },
];

export default function CourseManagement() {
  const { api } = useAuth(); // Usamos la API proporcionada por el contexto
  const [courses, setCourses] = useState([]); // Guardamos los cursos
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Redirigir al curso

  // Función para obtener los cursos y sus promedios
  const fetchCourses = async () => {
    try {
      const coursesResponse = await api.get("/courses"); // Obtener los cursos
      const coursesData = coursesResponse.data;
      setCourses(coursesData);
    } catch (err) {
      console.error("Error al obtener los cursos o promedios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Función para encontrar el ícono correspondiente basado en el valor
  const getCourseIcon = (courseType) => {
    const icon = ICON_OPTIONS.find((option) => option.value === courseType);
    return icon ? icon.icon : faBook;
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`); // Redirigir al curso
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 space-y-4"
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
        initial="hidden"
        animate="visible"
        className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-custom pr-2"
      >
        <AnimatePresence>
          {!loading &&
            courses.map((course) => {
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.05 }}
                  className="group mb-6 p-5 bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-400 transition-all shadow-md"
                >
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <motion.div
                        whileHover={{ rotate: -5 }}
                        className="w-16 h-16 flex items-center justify-center rounded-lg shadow-lg"
                        style={{ backgroundColor: course.color }}
                      >
                        <FontAwesomeIcon
                          icon={getCourseIcon(course.icon)} // Asignar el ícono dinámico
                          className="text-white text-2xl transform group-hover:scale-110 transition-transform"
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
                        </div>
                      </div>
                    </div>
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
                            icon={
                              course.status === "active" ? faBook : faArchive
                            }
                            className="text-xs"
                          />
                          {course.status === "active"
                            ? "Publicado"
                            : "Borrador"}
                        </span>
                      </motion.div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCourseClick(course.id)} // Redirigir al curso
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          Ir al curso
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
