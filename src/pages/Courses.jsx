import { motion, AnimatePresence } from "framer-motion";
import { CourseCard } from "../components/courses/CoursesCard";
import { useAuth } from "../context/AuthContext";
import CriticalDeadlines from "../components/dashboard/CriticalDeadlines";
import courses from "../data/courses";
import AdminCourses from "../admin/Acourses/AdminCourses";
import RecentActivities from "../components/courses/RecentActivities";

const Courses = () => {
  const staggerDelay = 0.15;
  const { isAdmin } = useAuth();

  return (
    <div>
      {isAdmin ? (
        <AdminCourses />
      ) : (
        <section className="px-4 py-8 max-w-7xl mx-auto">
          <motion.div
            className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Tus Cursos
            </motion.h2>
          </motion.div>

          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * staggerDelay,
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      },
                    },
                  }}
                  whileHover="hover"
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
            <div className="mt-12 grid grid-cols-1  lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CriticalDeadlines />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <RecentActivities />
              </motion.div>
            </div>
          </AnimatePresence>
        </section>
      )}
    </div>
  );
};

export default Courses;
