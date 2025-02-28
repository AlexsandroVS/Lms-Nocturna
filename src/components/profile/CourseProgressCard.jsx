/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Asegúrate de que useAuth esté correctamente importado

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const CourseProgressCard = ({ course, index }) => {
  const { api, currentUser } = useAuth(); // Obtener el currentUser y api desde useAuth
  const [courseAverage, setCourseAverage] = useState(0);

  // Llamada para obtener el promedio de este curso
  useEffect(() => {
    const fetchCourseAverage = async () => {
      if (!currentUser?.id) return;

      try {
        const response = await api.get(
          `/grades/user/${currentUser.id}/course/${course.id}/averages`
        );
        if (response.data.success) {
          const percentage = response.data.data.courseAverage * 5; // Convertir de 20 a porcentaje
          setCourseAverage(percentage);
        }
      } catch (error) {
        console.error("Error al obtener el promedio del curso:", error);
      }
    };

    fetchCourseAverage();
  }, [api, currentUser?.id, course.id]);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <FontAwesomeIcon
          icon={course.icon}
          className="text-3xl"
          style={{ color: course.color }}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-xl">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.duration}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Promedio del Curso</span>
          <span>{Math.round(courseAverage)}%</span> {/* Muestra el promedio del curso */}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full transition-all duration-1000 ease-in-out"
            style={{
              width: `${courseAverage}%`, // Usa el promedio para la barra
              backgroundColor: course.color,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${courseAverage}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CourseProgressCard;
