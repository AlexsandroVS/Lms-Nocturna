import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBookOpen, 
  faUser, 
  faSignOutAlt, 
  faSearch, 
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { currentUser, logout, api } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const coursesLinkText = currentUser?.role === 'admin' ? 'Administrar Cursos' : 'Mis Cursos';

const navigationItems = [
  { icon: faHome, text: 'Inicio', link: '/dashboard' },
  { icon: faBookOpen, text: coursesLinkText, link: '/courses' },
  ...(currentUser?.role !== 'admin' && currentUser?.role !== 'teacher'
    ? [{ icon: faUser, text: 'Mi Perfil', link: '/profile' }]
    : []),
];


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

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/courses/search/suggestions?query=${encodeURIComponent(searchQuery)}`);
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([
        { type: 'term', value: searchQuery + ' básico' },
        { type: 'term', value: searchQuery + ' avanzado' },
        { type: 'term', value: 'Introducción a ' + searchQuery }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (item.type === 'course') {
      navigate(`/courses/${item.id}`);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          {/* Barra de búsqueda */}
          <div className="flex items-center flex-1 mr-4" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full py-2 pl-4 pr-10 rounded-full border border-slate-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length > 1) {
                    setShowSuggestions(true);
                  }
                }}
              />
              <div className="absolute right-3 top-2.5 flex items-center">
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="text-gray-400 animate-spin mr-1" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    className="text-gray-500 hover:text-purple-700 mr-1"
                    onClick={() => setSearchQuery('')}
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="text-gray-500 hover:text-purple-700"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>

              {/* Sugerencias de búsqueda mejoradas - AHORA DENTRO DEL FORM */}
              <AnimatePresence>
                {showSuggestions && (suggestions.length > 0 || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 5 }} // Pequeño desplazamiento hacia abajo
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 top-full left-0 w-full bg-white rounded-lg shadow-lg border border-slate-200 mt-1 overflow-hidden"
                  >
                    <ul className="py-1 max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <li className="px-4 py-2 text-slate-500 flex items-center">
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                          Buscando...
                        </li>
                      ) : (
                        <>
                          {/* Cursos sugeridos */}
                          {suggestions.filter(s => s.type === 'course').slice(0, 3).map((course) => (
                            <li
                              key={`course-${course.id}`}
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                              onClick={() => handleSuggestionClick(course)}
                            >
                              <div>
                                <p className="text-slate-800 font-medium">{course.title}</p>
                                {course.category && (
                                  <p className="text-slate-500 text-sm mt-1">{course.category}</p>
                                )}
                              </div>
                            </li>
                          ))}

                          {/* Términos de búsqueda sugeridos */}
                          {suggestions.filter(s => s.type === 'term').map((term, index) => (
                            <li
                              key={`term-${index}`}
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                              onClick={() => handleSuggestionClick(term)}
                            >
                              <div className="flex items-center text-slate-700">
                                <FontAwesomeIcon icon={faSearch} className="text-slate-400 mr-3" />
                                <span>{term.value}</span>
                              </div>
                            </li>
                          ))}

                          {/* Búsqueda actual */}
                          <li
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer bg-slate-50"
                            onClick={() => {
                              navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
                              setShowSuggestions(false);
                            }}
                          >
                            <div className="flex items-center text-purple-700 font-medium">
                              <FontAwesomeIcon icon={faSearch} className="mr-3" />
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

          {/* Enlaces de navegación */}
          <div className="flex items-center space-x-6">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="text-purple-700 hover:text-purple-900 px-2 py-1 rounded-md text-lg font-medium transition duration-200 flex items-center"
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                <span>{item.text}</span>
              </Link>
            ))}
            
            <button
              onClick={logout}
              className="text-purple-700 hover:text-purple-900 px-2 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              <span className='text-lg'>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}