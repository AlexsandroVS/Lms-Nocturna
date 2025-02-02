/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import Chart from "../../utils/chartConfig";

export const CourseProgressChart = () => {
  const chartRef = useRef(null);
  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Progreso mensual",
        data: [65, 59, 80, 81, 56, 55],
        borderColor: "#4F46E5",
        tension: 0.4,
      },
    ],
  };
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold mb-4">Progreso Académico</h3>
      <div className="h-64">
        <Line
          ref={chartRef}
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              x: {
                type: "category",
                grid: { display: false },
              },
              y: {
                beginAtZero: true,
                grid: { color: "#f3f4f6" },
              },
            },
          }}
        />
      </div>
    </motion.div>
  );
};
