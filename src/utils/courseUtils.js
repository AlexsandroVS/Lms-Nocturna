export const calculateModuleProgress = (module = {}) => {
  const activities = Array.isArray(module.activities) ? module.activities : [];
  const completed = activities.filter(a => a.completed).length;
  return (completed / activities.length) * 100 || 0;
};

export const calculateCourseProgress = (courseData = {}) => {
  const modules = Array.isArray(courseData.modules) ? courseData.modules : [];

  const modulesWithProgress = modules.map((module) => ({
    ...module,
    progress: calculateModuleProgress(module),
  }));

  const totalProgress =
    modulesWithProgress.reduce((sum, module) => sum + module.progress, 0) /
    (modulesWithProgress.length || 1); // Evita división por 0

  return {
    ...courseData,
    modules: modulesWithProgress,
    progress: totalProgress || 0,
  };
};

export const countActivities = (module = {}) => {
  const activities = Array.isArray(module.activities) ? module.activities : [];
  return activities.length;
};

export const calculateModuleDuration = (module = {}) => {
  const activities = Array.isArray(module.activities) ? module.activities : [];

  return activities.reduce((total, activity) => {
    if (activity.type === "video" && activity.duration) {
      const [minutes, seconds] = activity.duration.split(":").map(Number);
      return total + minutes + (seconds > 0 ? 1 : 0);
    }
    if (activity.duration && typeof activity.duration === "string") {
      const minutes = parseInt(activity.duration) || 0;
      return total + minutes;
    }
    return total + 5;
  }, 0);
};
