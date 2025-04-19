import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/layout/Header";
import CourseCard from "../components/dashboard/CourseCard";
import AdminDashboard from "../admin/AdminDashboard";
import Avatar from "../components/ui/Avatar";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";

export default function Dashboard() {
  const { currentUser, isAdmin, loading, api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const banners = [
    "/img/banner-cursos.jpg",
    "/img/banner-cursos2.jpg",
    "/img/banner-cursos3.jpg",
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
    }
  }, [currentUser, api]);
  const uniqueCategories = [
    "all",
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))), // Faltaba este paréntesis
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    (course.category || "").toLowerCase().includes(search.toLowerCase());
  
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const coursesByCategory = filteredCourses.reduce((acc, course) => {
    const category = course.category || "Sin categoría";
    if (!acc[category]) acc[category] = [];
    acc[category].push(course);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
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

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Header />

      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <div className="space-y-8">
          {/* Bienvenida */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Avatar user={currentUser} size="lg" />
            <div>
              <h2 className="text-lg text-gray-500 font-medium">{getGreeting()}</h2>
              <motion.h1 
                className="text-2xl text-[#003049] font-bold text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text "
                whileHover={{ scale: 1.02 }}
              >
                Bienvenido de nuevo, {currentUser.name}
              </motion.h1>
            </div>
          </motion.div>

          {/* Slider de banners */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full aspect-[3/1] overflow-hidden rounded-2xl shadow-lg"
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

            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index === activeBanner
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Filtros - Versión Mejorada */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative w-full md:w-1/2">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 hover:shadow-md"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span>{selectedCategory === "all" ? "Todas las categorías" : selectedCategory}</span>
                <FiChevronDown className={`ml-2 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    {uniqueCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                          selectedCategory === cat ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        {cat === "all" ? "Todas las categorías" : cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Secciones por categoría */}
          <AnimatePresence>
            {Object.entries(coursesByCategory).map(([category, list], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-4"
              >
                <h3 className="text-3xl font-bold text-neutral-800 flex items-center">
                  <span className="w-2 h-6 bg-primary rounded-full mr-2"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {list.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => navigate(`/courses/${course.id}`)}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}