import { motion } from "framer-motion";

export const EnrollmentStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold mb-4">Inscripciones</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total estudiantes</span>
          <span className="font-medium">1,452</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Nuevos este mes</span>
          <span className="text-green-600 font-medium">+124</span>
        </div>
        <div className="h-px bg-gray-100 my-2" />
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Cursos activos</span>
          <span className="font-medium">23</span>
        </div>
      </div>
    </motion.div>
  );
};
