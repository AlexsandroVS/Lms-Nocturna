/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

const ProgressSidebar = ({ course, color }) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FontAwesomeIcon
            icon={faTasks}
            className="mr-3"
            style={{ color: color }}
          />
          Tu Progreso
        </h3>
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ backgroundColor: color }}
            />
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Completado</span>
            <span>{course.progress}%</span>
          </div>
        </div>
      </motion.div>

      <ResourcesSection resources={course.resources} color={color} />
    </div>
  );
};

const ResourcesSection = ({ resources, color }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="bg-white rounded-xl shadow-md p-6"
  >
    <h3 className="text-xl font-bold mb-4">Recursos Adicionales</h3>
    <ul className="space-y-3">
      {resources.map((resource, index) => (
        <motion.li
          key={index}
          whileHover={{ x: 5 }}
          className="hover:underline transition-colors"
          style={{ color: color }}
        >
          <a href={resource.link} className="flex items-center">
            <FontAwesomeIcon
              icon={resource.icon}
              className="mr-2 transition-transform hover:scale-110"
            />
            {resource.title}
          </a>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export default ProgressSidebar;