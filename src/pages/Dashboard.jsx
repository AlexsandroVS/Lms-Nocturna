/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "../components/dashboard/CourseCard";
import AdminDashboard from "../admin/AdminDashboard";
import Avatar from "../components/ui/Avatar";
import NoAccessModal from "../components/ui/NoAccessModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, isAdmin, isTeacher, loading, api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showNoAccessModal, setShowNoAccessModal] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const navigate = useNavigate();

  const banners = [
    "/img/banner-cursos1.png",
    "/img/banner-cursos2.png",
    "/img/banner-cursos3.png",
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get(`/courses`);
      setCourses(response.data);
    } catch (err) {
      console.error("Error al obtener cursos:", err);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setActiveBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  useEffect(() => {
    if (currentUser) {
      fetchCourses();
      fetchAssignments();
    }
  }, [currentUser, api]);
  const [isDragging, setIsDragging] = useState(false);
  let startX = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    const deltaX = Math.abs(e.touches[0].clientX - startX);
    if (deltaX > 10) {
      setIsDragging(true);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get(
        `/enrollments/student/${currentUser.id}/courses`
      );
      if (response.data.success) {
        setEnrolledCourseIds(response.data.courseIds);
      } else {
        setEnrolledCourseIds([]);
      }
    } catch (err) {
      console.error("Error al obtener cursos del estudiante:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.8,
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudo cargar el usuario.
        </p>
      </div>
    );
  }

  const coursesByCategory = courses.reduce((acc, course) => {
    const category = course.category || "Sin categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {isAdmin || isTeacher ? (
        <AdminDashboard />
      ) : (
        <div className="space-y-6 md:space-y-8">
          {/* Bienvenida - Mejorado para móviles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 gap-3 bg-white p-4 sm:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Avatar user={currentUser} size="md sm:lg" />
            <div className="text-center sm:text-left">
              <h2 className="text-sm sm:text-lg text-gray-500 font-medium">
                {getGreeting()}
              </h2>
              <motion.h1
                className="text-xl sm:text-2xl text-[#003049] font-bold text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text"
                whileHover={{ scale: 1.02 }}
              >
                Bienvenido de nuevo, {currentUser.name}
              </motion.h1>
            </div>
          </motion.div>

          {/* Slider de banners - Mejorado para móviles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-[3/2] sm:aspect-[2/1] overflow-hidden rounded-xl md:rounded-2xl shadow-lg"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={banners[activeBanner]}
                  alt={`Banner ${activeBanner + 1}`}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`h-1.5 sm:h-2 w-6 sm:w-8 rounded-full transition-all duration-300 ${
                    index === activeBanner
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Secciones por categoría - Mejorado para móviles */}
          <AnimatePresence>
            {Object.entries(coursesByCategory).map(
              ([category, list], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="space-y-3  md:space-y-4"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 flex items-center">
                    <span className="w-1.5 sm:w-2 h-4 sm:h-6 bg-primary rounded-full mr-2"></span>
                    {category}
                  </h3>

                  <div className="relative">
                    <div
                      className="flex gap-10 md:gap-2 overflow-x-auto no-scrollbar py-2 px-1 space-x-4 sm:px-0"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                    >
                      {list.map((course) => (
                        <div
                          key={course.id}
                          className="min-w-[250px] sm:min-w-[300px] max-w-[90%]"
                          onClick={() => {
                            if (isDragging) return; // Cancelar si estaba arrastrando
                            if (
                              enrolledCourseIds.includes(course.id) ||
                              isAdmin ||
                              isTeacher
                            ) {
                              navigate(`/courses/${course.id}`);
                            } else {
                              setShowNoAccessModal(true);
                            }
                          }}
                        >
                          <CourseCard course={course} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      )}
      <NoAccessModal
        open={showNoAccessModal}
        onClose={() => setShowNoAccessModal(false)}
      />
    </div>
  );
}
