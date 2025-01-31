export const calculateModuleProgress = (module) => {
    const completed = module.activities.filter(a => a.completed).length;
    return (completed / module.activities.length) * 100 || 0;
  };
  
  export const calculateCourseProgress = (courseData) => {
    const modulesWithProgress = courseData.modules.map(module => ({
      ...module,
      progress: calculateModuleProgress(module)
    }));
    
    const totalProgress = modulesWithProgress.reduce(
      (sum, module) => sum + module.progress, 0
    ) / modulesWithProgress.length;
    
    return {
      ...courseData,
      modules: modulesWithProgress,
      progress: totalProgress || 0
    };
  };
  
  export const countActivities = (module) => module.activities.length;
  
  export const calculateModuleDuration = (module) => {
    return module.activities.reduce((total, activity) => {
      if (activity.type === 'video' && activity.duration) {
        const [minutes, seconds] = activity.duration.split(':').map(Number);
        return total + minutes + (seconds > 0 ? 1 : 0);
      }
      if (activity.duration && typeof activity.duration === 'string') {
        const minutes = parseInt(activity.duration) || 0;
        return total + minutes;
      }
      return total + 5;
    }, 0);
  };