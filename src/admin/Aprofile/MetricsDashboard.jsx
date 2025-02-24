/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const MetricsDashboard = ({ users }) => {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const newRegistrations = users.filter(
    (u) => new Date(u.registrationDate) >= oneMonthAgo
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div
        className="bg-white shadow rounded-lg p-4"
        whileHover={{ scale: 1.02 }}
      >
        <p className="text-gray-500">Total de Usuarios</p>
        <h2 className="text-2xl font-bold">{totalUsers}</h2>
      </motion.div>
      <motion.div
        className="bg-white shadow rounded-lg p-4"
        whileHover={{ scale: 1.02 }}
      >
        <p className="text-gray-500">Usuarios Activos</p>
        <h2 className="text-2xl font-bold">{activeUsers}</h2>
      </motion.div>
      <motion.div
        className="bg-white shadow rounded-lg p-4"
        whileHover={{ scale: 1.02 }}
      >
        <p className="text-gray-500">Nuevos Registros (último mes)</p>
        <h2 className="text-2xl font-bold">{newRegistrations}</h2>
      </motion.div>
    </div>
  );
};

export default MetricsDashboard;
