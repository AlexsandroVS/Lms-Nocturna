/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { countActivities, calculateModuleDuration } from '../../utils/courseUtils';

const ModuleList = ({ modules, color, onModuleSelect }) => {
  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const totalActivities = countActivities(module);
        const totalMinutes = calculateModuleDuration(module);

        return (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer group"
            onClick={() => onModuleSelect(module)}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="mr-2 transition-colors"
                      style={{ color: color }}
                    />
                    {totalActivities} actividades
                  </motion.span>
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="mr-2 transition-colors"
                      style={{ color: color }}
                    />
                    {totalMinutes} minutos
                  </motion.span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full text-white font-medium flex items-center gap-2"
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.stopPropagation();
                  onModuleSelect(module);
                }}
              >
                Ver módulo
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ModuleList;