/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const CourseHeader = ({ course, color, courseAverage }) => {
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
          <motion.h1
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white tracking-tight drop-shadow-sm"
          >
            {course.title}
          </motion.h1>
          <p className="text-white text-opacity-90 text-base md:text-lg max-w-2xl leading-snug">
            {course.description || "Sin descripción disponible."}
          </p>
        </div>

        {/* Stats */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="flex flex-col md:items-end gap-3"
        >
          <div className="flex items-center gap-2 text-white text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">
            <FontAwesomeIcon icon={faClock} className="text-white" />
            <span>Duración: {course.durationHours || 0} h</span>
          </div>
          <div
            className="px-4 py-2 bg-white/20 text-white rounded-full font-medium text-sm shadow-sm backdrop-blur-md"
          >
            Promedio del curso: {courseAverage || "No disponible"}%
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseHeader;
