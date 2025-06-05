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
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Nuevo estado para cursos asignados
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

  // Nueva función para obtener los cursos asignados
  // Dashboard.jsx
  const fetchEnrolledCourses = async () => {
    try {
      const response = await api.get(
        `/enrollments/student/${currentUser.id}/courses`
      );

      if (response.data.success && response.data.courses) {
        setEnrolledCourses(response.data.courses);
        setEnrolledCourseIds(response.data.courses.map((course) => course.id));
      } else {
        setEnrolledCourses([]);
        setEnrolledCourseIds([]);
      }
    } catch (err) {
      console.error("Error al obtener cursos asignados:", err);
      setEnrolledCourses([]);
      setEnrolledCourseIds([]);
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
      fetchEnrolledCourses(); // Cambiado a la nueva función
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
    // Excluir cursos que ya están en enrolledCourses
    if (!enrolledCourseIds.includes(course.id)) {
      const category = course.category || "Sin categoría";
      if (!acc[category]) acc[category] = [];
      acc[category].push(course);
    }
    return acc;
  }, {});

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {isAdmin || isTeacher ? (
        <AdminDashboard />
      ) : (
        <div className="space-y-6 md:space-y-8">
          {/* Bienvenida */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-row items-center gap-3 bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Avatar
              user={currentUser}
              size="sm"
              className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <h2 className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
                  {getGreeting()},
                </h2>
                <h1 className="text-base sm:text-lg font-bold text-[#003049] truncate">
                  {currentUser.name.split(" ")[0]}
                </h1>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
                ¡Es un placer verte de nuevo!
              </p>
            </div>
          </motion.div>

          {/* Slider de banners */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-xl shadow-lg"
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
                  className="w-full h-full object-contain sm:object-cover object-center"
                  onError={(e) => {
                    e.target.src = "/img/default-banner.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    index === activeBanner ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Nueva sección: Cursos asignados al usuario */}
          {enrolledCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3 md:space-y-4"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 flex items-center">
                <span className="w-1.5 sm:w-2 h-4 sm:h-6 bg-primary rounded-full mr-2"></span>
                Tus Cursos
              </h3>

              <div className="relative">
                <div
                  className="flex gap-14 md:gap-2 overflow-x-auto no-scrollbar py-2 px-1 space-x-4 sm:px-0"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                >
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="min-w-[250px] sm:min-w-[300px] max-w-[90%]"
                      onClick={() => {
                        if (isDragging) return;
                        if (enrolledCourseIds.includes(course.id)) {
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
          )}

          {/* Secciones por categoría (excluyendo cursos asignados) */}
          <AnimatePresence>
            {Object.entries(coursesByCategory).map(
              ([category, list], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }} // Ajustado el delay
                  className="space-y-3 md:space-y-4"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 flex items-center">
                    <span className="w-1.5 sm:w-2 h-4 sm:h-6 bg-primary rounded-full mr-2"></span>
                    {category}
                  </h3>

                  <div className="relative">
                    <div
                      className="flex gap-14 md:gap-2 overflow-x-auto no-scrollbar py-2 px-1 space-x-4 sm:px-0"
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                    >
                      {list.map((course) => (
                        <div
                          key={course.id}
                          className="min-w-[250px] sm:min-w-[300px] max-w-[90%]"
                          onClick={() => {
                            if (isDragging) return;
                            if (enrolledCourseIds.includes(course.id)) {
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
