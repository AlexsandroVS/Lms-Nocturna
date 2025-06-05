/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';


const CourseHeader = ({ course, color, courseAverage, userRole }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 mb-8 shadow-xl relative overflow-hidden border border-white/20 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${color}dd, ${color}90)`,
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Info Principal */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm">
            {course.title}
          </h1>
          <p className="text-white text-opacity-90 text-base md:text-lg max-w-2xl leading-snug">
            {course.description || "Sin descripción disponible."}
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:items-end gap-3">
        
          
          {/* Mostrar promedio solo si no es admin */}
          {userRole !== 'admin' && userRole !== 'teacher' && (
            <div className="px-4 py-2 bg-white/20 text-white rounded-full font-medium text-sm shadow-sm backdrop-blur-md">
              Promedio del curso: {courseAverage || "No disponible"}%
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseHeader;