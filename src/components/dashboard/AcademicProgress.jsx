/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext"; // Para obtener el currentUser

export default function AcademicProgress({ courses }) {
  const { currentUser, api } = useAuth(); // Obtener el currentUser y api desde useAuth
  const [courseData, setCourseData] = useState([]);
  const userId = currentUser?.id; // Obtener el userId del currentUser

  useEffect(() => {
    // Verificamos si tenemos el userId
    if (!userId) return;

    const fetchCourseAverages = async () => {
      try {
        const coursePromises = courses.map(async (course) => {
          const response = await api.get(
            `/grades/user/${userId}/course/${course.id}/averages`
          );
          const courseAverage = response.data.data.courseAverage;
          return {
            ...course,
            courseAverage: courseAverage ? courseAverage * 5 : 0, // Convertimos a porcentaje (si el promedio no es 0)
          };
        });

        // Esperamos todas las promesas
        const coursesWithAverages = await Promise.all(coursePromises);
        setCourseData(coursesWithAverages); // Actualizamos el estado con los cursos y promedios
      } catch (err) {
        console.error("Error al obtener los promedios:", err);
      }
    };

    fetchCourseAverages();
  }, [courses, userId, api]); // Dependencias: se ejecuta cuando `courses` o `userId` cambian

  const average = Math.round(
    courseData.reduce((acc, curr) => acc + curr.courseAverage, 0) /
      courseData.length
  );

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl overflow-auto h-64"
    >
      <h2 className="font-semibold mb-4 text-[#003049] text-xl">
        Tu Avance Académico
      </h2>
      <div className="space-y-4">
        {courseData.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between font-semibold text-lg">
              <span style={{ color: course.color }}>{course.title}</span>
              <span
                className="text-xl font-semibold"
                style={{ color: course.color }}
              >
                {Math.round(course.courseAverage)}% {/* Mostramos el courseAverage como porcentaje */}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(course.courseAverage)}%`, // Barra de progreso con el porcentaje
                  backgroundColor: course.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">Promedio general: {average}%</p> {/* Promedio general de todos los cursos */}
    </motion.div>
  );
}
