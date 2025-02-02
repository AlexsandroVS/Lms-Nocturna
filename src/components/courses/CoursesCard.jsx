/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { cardVariants } from "../../utils/animationUtils";

export const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="block h-full group">
      <motion.div
        className="relative h-full bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-2xl p-6 cursor-pointer flex flex-col justify-between overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Efecto de brillo al hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="absolute w-32 h-32 bg-gradient-radial from-white/30 to-transparent"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* Icono animado */}
        <motion.div
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-sm bg-white/30"
          style={{ color: course.color }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <FontAwesomeIcon icon={course.icon} className="text-xl" />
        </motion.div>

        {/* Contenido principal */}
        <div className="h-full flex flex-col pt-4 space-y-4">
          <div className="flex-1">
            <span
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: course.color }}
            >
              {course.duration}
            </span>

            <motion.h3
              className="text-2xl font-bold text-gray-900 mt-2 line-clamp-2 leading-tight"
              layoutId={`title-${course.id}`}
            >
              {course.title}
            </motion.h3>

            <motion.p
              className="text-gray-600 text-sm line-clamp-3 leading-relaxed mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {course.description}
            </motion.p>
          </div>

          {/* Sección inferior */}
          <motion.div className="border-t pt-4 space-y-4">
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <motion.div
                className="h-2 bg-gray-200 rounded-full overflow-hidden"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: course.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1.5, type: "spring" }}
                />
              </motion.div>
            </div>

            <motion.button
              className="w-full cursor-pointer py-3 text-white rounded-xl font-medium flex items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: course.color }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 8px 24px ${course.color}40`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver curso completo
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </motion.span>
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};
