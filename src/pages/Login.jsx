import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import fondoLogin from "../assets/fondo-login.jpeg";
import logoRojo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${fondoLogin})`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-96 min-h-[480px] flex flex-col justify-center"
      >
        <div className="flex justify-center mb-10">
          <img src={logoRojo} alt="Logo" className="h-24" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Input de Email */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex rounded-xl overflow-hidden shadow-sm">
              <div className="w-14 bg-[#d62828] flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white text-xl"
                />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                className="flex-1 px-4 py-3 bg-white focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Input de Contraseña */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex rounded-xl overflow-hidden shadow-sm">
              <div className="w-14 bg-[#d62828] flex items-center justify-center">
                <FontAwesomeIcon icon={faLock} className="text-white text-xl" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                className="flex-1 px-4 py-3 bg-white focus:outline-none"
              />
            </div>
          </motion.div>

          {/* Botón de Ingreso */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          >
            <motion.button
              type="submit"
              className="w-full py-3 cursor-pointer bg-[#d62828] text-white rounded-xl hover:bg-[#b32020] transition-colors font-semibold flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              transition={{ type: "spring", stiffness: 300, damping: 10 }} 
            >
              <motion.span
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Ingresar
              </motion.span>
              <motion.span
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </motion.span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
