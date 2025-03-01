import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faBookOpen, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { currentUser, logout } = useAuth(); 

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    { icon: faHome, text: "Inicio", link: "/dashboard" },
    { icon: faBookOpen, text: "Cursos", link: "/courses" },
    { icon: faUser, text: "Mi Perfil", link: "/profile" },
  ];

  // Animaciones para los enlaces del menú
  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  // Animaciones para el menú móvil
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <nav className="bg-navbar h-auto shadow-xl fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y menú de escritorio */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-16 cursor-pointer"
                src={Logo}
                onClick={() => navigate("/dashboard")}
                alt="Logo LMS"
              />
            </div>
            <div className="hidden md:flex md:space-x-4 md:ml-10">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.link}
                    className="text-white/90 hover:text-white px-3 py-2 rounded-md text-lg font-medium flex items-center transition duration-300"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.text}
                  </Link>
                </motion.div>
              ))}

              {/* Botón de Cerrar Sesión */}
              <motion.div
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: navigationItems.length * 0.1 }}
              >
                <button
                  onClick={handleLogout}
                  className="text-white/90 hover:text-white px-3 py-2 rounded-md text-lg font-medium flex items-center transition duration-300"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Cerrar Sesión
                </button>
              </motion.div>
            </div>
          </div>

          {/* Botón del menú móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#b32020] focus:outline-none transition duration-300"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.link}
                    className="text-white hover:bg-[#b32020] px-3 py-2 rounded-md text-base font-medium flex items-center transition duration-300"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.text}
                  </Link>
                </motion.div>
              ))}

              {/* Botón de Cerrar Sesión en menú móvil */}
              <motion.div
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: navigationItems.length * 0.1 }}
              >
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-[#b32020] px-3 py-2 rounded-md text-base font-medium flex items-center transition duration-300 w-full text-left"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Cerrar Sesión
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
