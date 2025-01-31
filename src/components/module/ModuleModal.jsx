/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import {useEffect, useState} from'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFilePdf, faVideo, faCircleCheck, faCircle } from '@fortawesome/free-solid-svg-icons';

const ActivityCard = ({ activity, color, onToggle }) => {
  const getIcon = () => {
    switch(activity.type) {
      case 'pdf': return faFilePdf;
      case 'video': return faVideo;
      case 'quiz': return faCircleCheck;
      default: return faFilePdf;
    }
  };

  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-all cursor-pointer ${
        activity.completed ? 'border-l-4' : 'hover:border-l-4'
      }`}
      style={{
        borderColor: activity.completed ? color : 'transparent'
      }}
      whileHover={{ scale: 1.01 }}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4">
        <FontAwesomeIcon 
          icon={getIcon()} 
          className={`text-xl mt-1 transition-colors ${
            activity.completed ? 'text-green-500' : 'text-gray-400'
          }`}
        />
        <div className="flex-1">
          <h3 className={`font-semibold text-lg mb-1 ${
            activity.completed ? 'text-green-700' : 'text-gray-900'
          }`}>
            {activity.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {activity.type === 'video' && (
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faVideo} />
                {activity.duration}
              </span>
            )}
            {activity.type === 'pdf' && (
              <span>{activity.pages} páginas</span>
            )}
            {activity.type === 'quiz' && (
              <span>{activity.questions} preguntas</span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon 
            icon={activity.completed ? faCircleCheck : faCircle}
            className={`text-xl ${
              activity.completed ? 'text-green-500' : 'text-gray-300'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ModuleModal = ({ module: initialModule, color, onClose, onToggleActivity }) => {
  const [currentModule, setCurrentModule] = useState(initialModule);

  useEffect(() => {
    setCurrentModule(initialModule);
  }, [initialModule]);

  const completedCount = currentModule.activities.filter(a => a.completed).length;
  const totalActivities = currentModule.activities.length;
  const progress = (completedCount / totalActivities) * 100;

  const handleActivityToggle = (index) => {
    const updatedActivities = currentModule.activities.map((activity, i) => 
      i === index ? {...activity, completed: !activity.completed} : activity
    );
    
    const updatedModule = {
      ...currentModule,
      activities: updatedActivities
    };
    
    setCurrentModule(updatedModule);
    onToggleActivity(index);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color }}>
            {currentModule.title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span className="text-sm font-medium" style={{ color }}>
                {Math.round(progress)}% Completado
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {completedCount} de {totalActivities} actividades completadas
            </p>
          </div>

          <div className="space-y-4">
            {currentModule.activities.map((activity, index) => (
              <ActivityCard 
                key={index}
                activity={activity}
                color={color}
                onToggle={() => handleActivityToggle(index)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModuleModal;