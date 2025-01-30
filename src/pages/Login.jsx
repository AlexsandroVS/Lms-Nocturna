import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faArrowRight,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import fondoLogin from "../assets/fondo-login.jpeg";
import logoRojo from "../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCredentials = (email, password) => {
    // Validación de ejemplo (reemplazar con conexión a backend)
    const isAdmin = email === "admin@example.com" && password === "admin123";
    const isUser = email === "user@example.com" && password === "user123";
    
    if (!isAdmin && !isUser) {
      throw new Error("Credenciales inválidas");
    }
    
    return {
      role: isAdmin ? "admin" : "user",
      token: "fake-jwt-token",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const { role } = validateCredentials(email, password);
      
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem("userRole", role);
      localStorage.setItem("authToken", "fake-token");
      
      navigate(role === "admin" ? "/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
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
          {/* Mensaje de error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/20 p-3 rounded-lg border border-red-500 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faUserShield} className="text-red-500" />
              <span className="text-red-200 text-sm">{error}</span>
            </motion.div>
          )}

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="w-full py-3 cursor-pointer bg-[#d62828] text-white rounded-xl hover:bg-[#b32020] transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <motion.span
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {isSubmitting ? "Verificando..." : "Ingresar"}
              </motion.span>
              {!isSubmitting && (
                <motion.span
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;