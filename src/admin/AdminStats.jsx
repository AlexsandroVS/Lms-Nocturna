import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Usamos la API proporcionada por el contexto
import { containerVariants, itemVariants } from "../utils/animationUtils";

export default function AdminStats() {
  const controls = useAnimation();
  const { api } = useAuth(); // Accedemos a la API de autenticación
  const [activeUsers, setActiveUsers] = useState(0); // Para almacenar el número de usuarios activos
  const [totalCourses, setTotalCourses] = useState(0); // Para almacenar el número total de cursos

  // Función para obtener los usuarios activos
  const fetchActiveUsers = async () => {
    try {
      const response = await api.get("/users");
      const activeUsersCount = response.data.filter(user => user.IsActive === 1).length; // Filtrar los usuarios activos
      setActiveUsers(activeUsersCount);
    } catch (err) {
      console.error("Error al obtener los usuarios:", err);
    }
  };

  // Función para obtener los cursos
  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses"); // Llamado para obtener todos los cursos
      setTotalCourses(response.data.length); // Asignamos el número total de cursos
    } catch (err) {
      console.error("Error al obtener los cursos:", err);
    }
  };

  useEffect(() => {
    fetchActiveUsers(); // Obtener usuarios activos
    fetchCourses(); // Obtener cursos
    controls.start("visible");
  }, [controls]);

  // Métricas con los valores obtenidos
  const metrics = [
    {
      title: "Usuarios Activos",
      value: activeUsers,
      icon: "👥",
      color: "bg-white",
    },
    {
      title: "Cursos Publicados",
      value: totalCourses,
      icon: "📚",
      color: "bg-white",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={`p-6 rounded-xl shadow-lg border-l-4 ${metric.color} transition-all hover:shadow-xl hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                {metric.title}
              </h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-gray-800">
                  {metric.value}
                </p>
              </div>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>

          {/* Barra de progreso (opcional) */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
