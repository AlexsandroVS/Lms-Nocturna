/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
export const CourseProgressCard = ({ course, index }) => (
  <motion.div
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
    className="bg-gray-50 rounded-xl overflow-auto p-4 hover:shadow-md transition-all"
  >
    <div className="flex items-center gap-3 mb-4">
      <FontAwesomeIcon
        icon={course.icon}
        className="text-2xl"
        style={{ color: course.color }}
      />
      <div className="flex-1">
        <h3 className="font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-600">{course.duration}</p>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <motion.div
        className="h-2 rounded-full transition-all duration-1000"
        style={{
          backgroundColor: course.color,
          width: `${course.progress}%`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${course.progress}%` }}
      />
    </div>
  </motion.div>
);
