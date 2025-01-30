import { motion } from "framer-motion";
export default function CriticalDeadlines() {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }} className="bg-white overflow-auto  p-6 rounded-xl shadow-xl scrollbar-custom">
        <h2 className="font-semibold mb-4 text-xl text-[#003049]">📅 Plazos Críticos</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#d62828] pl-4">
            <p className="text-xl font-medium">Actividad 10 - Mantenimiento Industrial</p>
            <p className="text-md text-gray-500">Hoy 23:59 <span className="ml-2">🔥</span></p>
          </div>
          <div className="border-l-4 border-[#fcbf49] pl-4">
            <p className="text-xl font-medium">Proyecto Final - Programación de PLC</p>
            <p className="text-md text-gray-500">Viernes 15/12</p>
          </div>
        </div>
      </motion.div>
    )
  }