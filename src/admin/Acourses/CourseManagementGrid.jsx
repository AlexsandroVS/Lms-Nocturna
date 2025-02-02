import { motion } from "framer-motion";
import { CourseCard } from "../../components/courses/CoursesCard";
import courses from "../../data/courses";

export const CourseManagementGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Gestión de Cursos</h3>
        <span className="text-gray-500">{courses.length} cursos</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <CourseCard course={course} />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                ✏️
              </button>
              <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50">
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
