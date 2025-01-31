import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseHeader from '../components/courses/CourseHeader';
import ModuleList from '../components/module/ModuleList';
import ProgressSidebar from '../components/courses/ProgressSidebar';
import ModuleModal from '../components/module/ModuleModal';
import courses from '../data/courses';
import { calculateCourseProgress } from '../utils/courseUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CoursePage = () => {
  const { id } = useParams();
  const [selectedModule, setSelectedModule] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const originalCourse = courses.find(c => c.id === Number(id));
    if (originalCourse) {
      setCourse(calculateCourseProgress(originalCourse));
    }
  }, [id]);

  const handleToggleActivity = (moduleId, activityIndex) => {
    setCourse(prev => {
      const updatedModules = prev.modules.map(module => {
        if (module.id === moduleId) {
          const updatedActivities = module.activities.map((activity, index) => 
            index === activityIndex ? {...activity, completed: !activity.completed} : activity
          );
          return {...module, activities: updatedActivities};
        }
        return module;
      });
      
      return calculateCourseProgress({...prev, modules: updatedModules});
    });
  };

  if (!course) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Curso no encontrado
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-8"
    >
      <CourseHeader course={course} color={course.color} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold mb-6 flex items-center"
          >
            <FontAwesomeIcon
              icon={course.icon}
              className="mr-3 text-3xl transition-transform hover:scale-110"
              style={{ color: course.color }}
            />
            Módulos del Curso
          </motion.h2>
          
          <ModuleList 
            modules={course.modules} 
            color={course.color} 
            onModuleSelect={setSelectedModule} 
          />
        </div>

        <ProgressSidebar course={course} color={course.color} />
      </div>

      {selectedModule && (
        <ModuleModal 
          module={selectedModule}
          color={course.color}
          onClose={() => setSelectedModule(null)}
          onToggleActivity={(index) => handleToggleActivity(selectedModule.id, index)}
        />
      )}
    </motion.div>
  );
};

export default CoursePage;