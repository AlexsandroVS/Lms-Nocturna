import { motion } from "framer-motion";

const stats = [
  { name: 'Usuarios activos', value: '1,024', change: '+12%', changeType: 'positive' },
  { name: 'Cursos publicados', value: '24', change: '+4%', changeType: 'positive' },
  { name: 'Completación promedio', value: '68%', change: '-2%', changeType: 'negative' },
];

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, statIdx) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: statIdx * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
            <div className={`flex items-center ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}