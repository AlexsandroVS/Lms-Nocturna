import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react"; // Asegúrate de importar useState y useEffect
import CoursesCard from "../components/courses/CoursesCard";
import { useAuth } from "../context/AuthContext";
import CriticalDeadlines from "../components/dashboard/CriticalDeadlines";
import RecentActivities from "../components/courses/RecentActivities";
import AdminCourses from "../admin/Acourses/AdminCourses";

const Courses = () => {
  const { isAdmin, api } = useAuth(); // Obtener el estado de si es admin
  const [courses, setCourses] = useState([]); // Para almacenar los cursos
  const [loading, setLoading] = useState(true); // Para manejar la carga
  const [error, setError] = useState(""); // Para manejar errores

  // Cargar los cursos para los usuarios normales
  useEffect(() => {
    if (!isAdmin) {
      const fetchCourses = async () => {
        try {
          const response = await api.get("/courses"); // Hacemos la llamada a la API
          setCourses(response.data); 
        } catch (err) {
          setError("Error al obtener los cursos");
          console.error(err);
        } finally {
          setLoading(false); // Cambiar el estado de carga
        }
      };

      fetchCourses();
    }
  }, [isAdmin, api]); // Solo ejecutar si el estado de isAdmin cambia

  return (
    <div>
      {isAdmin ? (
        <AdminCourses /> // Mostrar AdminCourses si es admin
      ) : (
        <section className="px-4 py-8 max-w-7xl mx-auto">
          <motion.div
            className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Tus Cursos
            </motion.h2>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-xl text-gray-500">Cargando cursos...</div>
          ) : error ? (
            <div className="text-center py-20 text-xl text-red-500">{error}</div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.15,
                          type: "spring",
                          stiffness: 100,
                          damping: 20,
                        },
                      },
                    }}
                    whileHover="hover"
                  >
                    <CoursesCard course={course} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CriticalDeadlines />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                
                </motion.div>
              </div>
            </AnimatePresence>
          )}
        </section>
      )}
    </div>
  );
};

export default Courses;
