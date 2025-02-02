import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

export const LearningAnalytics = () => {
  const data = {
    labels: ["Completados", "En progreso", "No iniciados"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#4F46E5", "#818CF8", "#E0E7FF"],
      },
    ],
  };

  return (
    <motion.div
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold mb-4">Distribución de Cursos</h3>
      <div className="h-48 relative">
        <Doughnut
          data={data}
          options={{
            cutout: "70%",
            plugins: { legend: { position: "bottom" } },
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">65%</span>
        </div>
      </div>
    </motion.div>
  );
};
