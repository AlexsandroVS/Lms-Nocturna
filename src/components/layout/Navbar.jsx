/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faUser,
  faSignOutAlt,
  faSearch,
  faTimes,
  faSpinner,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import NoAccessModal from "../ui/NoAccessModal";

export default function Navbar() {
  const { currentUser, logout, api } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [showNoAccessModal, setShowNoAccessModal] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const coursesLinkText =
    currentUser?.role === "admin" ? "Administrar Cursos" : "Mis Cursos";

  const navigationItems = [
    { icon: faHome, text: "Inicio", link: "/dashboard" },
    { icon: faBookOpen, text: coursesLinkText, link: "/courses" },
    ...(currentUser?.role !== "admin" && currentUser?.role !== "teacher"
      ? [{ icon: faUser, text: "Mi Perfil", link: "/profile" }]
      : []),
  ];

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser?.role === "student") {
        try {
          const res = await api.get(
            `/enrollments/student/${currentUser.id}/courses`
          );
          setEnrolledCourseIds(res.data.courseIds || []);
        } catch (err) {
          console.error("Error al obtener cursos inscritos:", err);
        }
      }
    };
    fetchEnrollments();
  }, [currentUser, api]);

  // Búsqueda con debounce mejorado
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 1) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // En la función fetchSuggestions:
const fetchSuggestions = async () => {
  try {
    setIsLoading(true);

    // Obtener los cursos del estudiante
    const enrolledRes = await api.get(`/enrollments/student/${currentUser.id}/courses`);
    const courseIds = enrolledRes.data.courses?.map((c) => Number(c.id)) || [];
    setEnrolledCourseIds(courseIds); // ✅ Actualizar el estado correctamente

    // Obtener sugerencias sin filtrar
    const response = await api.get(`/courses/search/suggestions?query=${encodeURIComponent(searchQuery)}`);
    const suggestionsRaw = response.data || [];

    // ✅ Filtrar las sugerencias tipo "course" por inscripción
    const filtered = suggestionsRaw.filter(item =>
      item.type !== "course" || courseIds.includes(Number(item.id))
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    setSuggestions([
      { type: "term", value: `${searchQuery} básico` },
      { type: "term", value: `${searchQuery} avanzado` },
      { type: "term", value: `Introducción a ${searchQuery}` },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (item.type === "course") {
      const isStudent = currentUser?.role === "student";
      const isEnrolled = enrolledCourseIds.includes(item.id);

      if (!isStudent || isEnrolled) {
        navigate(`/courses/${item.id}`);
      } else {
        setShowNoAccessModal(true);
      }
    } else {
      setSearchQuery(item.value);
      navigate(`/search-results?query=${encodeURIComponent(item.value)}`);
    }
    setShowSuggestions(false);
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <nav
      className={`bg-white fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo y menú hamburguesa */}
          <div className="flex items-center flex-shrink-0 w-1/4 md:w-auto">
            <button
              type="button"
              className="md:hidden text-gray-600 hover:text-purple-700 mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/img/logo-continental.png"
                alt="Logo"
                className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto transition-all duration-300"
              />
            </Link>
          </div>

          {/* Barra de búsqueda - versión responsive */}
          <div
            className="hidden sm:flex flex-1 mx-2 md:mx-4 min-w-[150px] sm:max-w-md md:max-w-xl lg:max-w-2xl"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full py-1 sm:py-2 px-3 sm:px-4 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 1) {
                    setShowSuggestions(true);
                  }
                }}
                aria-label="Buscar cursos"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                {isLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="text-gray-400 animate-spin mr-1"
                  />
                ) : searchQuery ? (
                  <button
                    type="button"
                    className="text-gray-500 hover:text-purple-700 mr-1"
                    onClick={() => setSearchQuery("")}
                    aria-label="Limpiar búsqueda"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="text-gray-500 hover:text-purple-700"
                  aria-label="Buscar"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>

              {/* Sugerencias de búsqueda */}
              <AnimatePresence>
                {showSuggestions && (suggestions.length > 0 || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 5 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1 overflow-hidden"
                  >
                    <ul className="py-1 max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <li className="px-4 py-2 text-gray-500 flex items-center">
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="animate-spin mr-2"
                          />
                          Buscando...
                        </li>
                      ) : (
                        <>
                          {suggestions
                            .filter((s) => s.type === "course")
                            .slice(0, 3)
                            .map((course) => (
                              <li
                                key={`course-${course.id}`}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleSuggestionClick(course)}
                              >
                                <div>
                                  <p className="text-gray-800 font-medium">
                                    {course.title}
                                  </p>
                                  {course.category && (
                                    <p className="text-gray-500 text-sm mt-1">
                                      {course.category}
                                    </p>
                                  )}
                                </div>
                              </li>
                            ))}

                          {suggestions
                            .filter((s) => s.type === "term")
                            .map((term, index) => (
                              <li
                                key={`term-${index}`}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleSuggestionClick(term)}
                              >
                                <div className="flex items-center text-gray-700">
                                  <FontAwesomeIcon
                                    icon={faSearch}
                                    className="text-gray-400 mr-3"
                                  />
                                  <span>{term.value}</span>
                                </div>
                              </li>
                            ))}

                          <li
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer bg-gray-50"
                            onClick={() => {
                              navigate(
                                `/search-results?query=${encodeURIComponent(
                                  searchQuery
                                )}`
                              );
                              setShowSuggestions(false);
                            }}
                          >
                            <div className="flex items-center text-purple-700 font-medium">
                              <FontAwesomeIcon
                                icon={faSearch}
                                className="mr-3"
                              />
                              <span>Buscar "{searchQuery}"</span>
                            </div>
                          </li>
                        </>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Enlaces de navegación - desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.text}
                to={item.link}
                className={({ isActive }) =>
                  `px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base flex items-center transition-all ${
                    isActive
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                  }`
                }
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="mr-2 text-sm sm:text-base"
                />
                <span>{item.text}</span>
              </NavLink>
            ))}

            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base font-medium transition-all flex items-center hover:bg-gray-50"
              aria-label="Cerrar sesión"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* Icono de búsqueda para móviles */}
          <div className="sm:hidden ml-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-600 hover:text-purple-700 p-2"
              aria-label="Buscar"
            >
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </button>
          </div>

          {/* Menú móvil */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-40"
                  onClick={() => setMobileMenuOpen(false)}
                />

                {/* Menú */}
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  ref={mobileMenuRef}
                  className="md:hidden fixed inset-y-0 right-0 w-4/5 sm:w-2/3 max-w-sm bg-white shadow-xl z-50"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        Menú
                      </h3>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-500 hover:text-purple-700"
                        aria-label="Cerrar menú"
                      >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                      </button>
                    </div>

                    {/* Barra de búsqueda (mobile) */}

                    {/* Enlaces de navegación (mobile) */}
                    <nav className="flex-1 overflow-y-auto">
                      <ul className="divide-y divide-gray-200">
                        {navigationItems.map((item, index) => (
                          <li key={index}>
                            <Link
                              to={item.link}
                              className={`flex items-center px-6 py-4 transition duration-200 ${
                                location.pathname === item.link
                                  ? "text-purple-700 bg-purple-50"
                                  : "text-gray-700 hover:text-purple-700 hover:bg-purple-50"
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <FontAwesomeIcon
                                icon={item.icon}
                                className="mr-4 text-lg"
                              />
                              <span className="text-base">{item.text}</span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={() => {
                              logout();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center px-6 py-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition duration-200"
                          >
                            <FontAwesomeIcon
                              icon={faSignOutAlt}
                              className="mr-4 text-lg"
                            />
                            <span className="text-base">Cerrar Sesión</span>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <NoAccessModal
        open={showNoAccessModal}
        onClose={() => setShowNoAccessModal(false)}
      />
    </nav>
  );
}
