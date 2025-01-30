import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBookOpen, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../assets/logo.png';

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { icon: faHome, text: 'Inicio', link: '/dashboard' },
    { icon: faBookOpen, text: 'Cursos', link: '/courses' },
    { icon: faUser, text: 'Mi Perfil', link: '/profile' },
    { icon: faSignOutAlt, text: 'Cerrar Sesión', link: '/' },
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
    <nav className="bg-[#d62828] h-auto shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y menú de escritorio */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-16" src={Logo} alt="Logo LMS" />
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
                    className="text-white/90 hover:text-white px-3 py-2 rounded-md text-lg font-medium flex items-center"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Botón del menú móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
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
                    className="text-white hover:bg-[#b32020] block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}