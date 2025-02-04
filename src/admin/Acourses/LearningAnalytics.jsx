import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";

export const LearningAnalytics = () => {
  const data = {
    labels: ["Completado", "En progreso", "No iniciados"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ["#4F46E5", "#818CF8", "#E0E7FF"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold mb-4">Estado de Cursos</h3>
      <div className="h-48 relative">
        <Doughnut
          data={data}
          options={{
            cutout: "70%",
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 12,
                  font: { size: 12 },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value}%`;
                  },
                },
              },
            },
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">65%</span>
        </div>
      </div>
    </motion.div>
  );
};
