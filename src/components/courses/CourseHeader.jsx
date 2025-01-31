/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const CourseHeader = ({ course, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-8 mb-8 shadow-lg relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${color}, ${color}90)` }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <motion.h1
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-4xl font-bold text-white mb-2 drop-shadow-md"
          >
            {course.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-opacity-90 text-lg max-w-2xl"
          >
            {course.description}
          </motion.p>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-white text-center md:text-right space-y-2"
        >
          <div className="flex items-center space-x-2 mb-2 justify-center md:justify-end">
            <FontAwesomeIcon icon={faClock} className="text-xl" />
            <span>Duración: {course.duration}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-semibold backdrop-blur-sm inline-block"
            style={{ color: color }}
          >
            Progreso: {course.progress}%
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseHeader;