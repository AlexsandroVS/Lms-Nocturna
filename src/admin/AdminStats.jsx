// components/admin/AdminStats.jsx
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { users } from "../data/userData";
import courses from "../data/courses";
import { containerVariants, itemVariants } from "../utils/animationUtils";
export default function AdminStats() {
  const controls = useAnimation();

  // Contar usuarios activos
  const activeUsers = users.filter((user) => user.isActive).length;
  const totalCourses = courses.length;
  // Métricas estáticas (puedes personalizarlas)
  const metrics = [
    {
      title: "Usuarios Activos",
      value: activeUsers,
      change: "+10%",
      icon: "👥",
      color: "bg-white",
    },
    {
      title: "Cursos Publicados",
      value: totalCourses,
      change: "+12%",
      icon: "📚",
      color: "bg-white",
    },
    {
      title: "Ingresos Mensuales",
      value: "$2,450",
      change: "+8%",
      icon: "💰",
      color: "bg-white",
    },
  ];

  // Animación de entrada
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

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
                <span
                  className={`ml-2 text-sm font-semibold ${
                    metric.change.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="text-3xl">{metric.icon}</div>
          </div>

          {/* Barra de progreso (opcional) */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "75%" }} // Puedes hacerlo dinámico
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
