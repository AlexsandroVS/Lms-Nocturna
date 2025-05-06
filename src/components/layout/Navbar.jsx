import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  // Determinar el texto del enlace de cursos basado en el rol
  const coursesLinkText = currentUser?.role === "admin" ? "Administrar Cursos" : "Mis Cursos";

  const navigationItems = [
    { icon: faHome, text: "Inicio", link: "/dashboard" },
    { icon: faBookOpen, text: coursesLinkText, link: "/courses" },
    // Solo mostrar "Mi Perfil" si no es admin
    ...(currentUser?.role !== "admin"
      ? [{ icon: faUser, text: "Mi Perfil", link: "/profile" }]
      : []),
  ];
  

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <nav className="bg-[#F8F9FB] border-b border-gray-200 h-20 fixed w-full top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src="/img/logo-ong.png"
              alt="Logo Viva Perú"
              className="h-14 w-auto cursor-pointer drop-shadow-sm"
              onClick={() => navigate("/dashboard")}
            />
          </div>

          {/* Navegación en pantallas grandes */}
          <div className="hidden md:flex md:space-x-6 items-center">
            {navigationItems.map((item, index) => (
              <motion.div
                key={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={item.link}
                  className="text-[#D16160] hover:text-[#bb4f4f] px-3 py-2 rounded-md text-lg font-semibold transition duration-200 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {item.text}
                </Link>
              </motion.div>
            ))}
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: navigationItems.length * 0.08 }}
            >
              <button
                onClick={handleLogout}
                className="text-[#D16160] hover:text-[#bb4f4f] px-3 py-2 rounded-md text-lg font-semibold transition duration-200 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Cerrar Sesión
              </button>
            </motion.div>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#D16160] hover:bg-[#fde8e8] transition duration-300"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="px-4 pt-4 pb-4 space-y-1">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="block text-[#D16160] hover:bg-[#fde8e8] px-4 py-2 rounded-md text-base font-medium transition duration-300"
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  {item.text}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left text-[#D16160] hover:bg-[#fde8e8] px-4 py-2 rounded-md text-base font-medium transition duration-300"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}