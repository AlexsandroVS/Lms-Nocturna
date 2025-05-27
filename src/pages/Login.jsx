import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import Typewriter from "../components/ui/Typewriter";

function Login() {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (!email || !password) {
      setStatus({ type: null, message: "" });
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => checkCredentials(), 1000);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const checkCredentials = async () => {
    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      if (response.success) {
        setStatus({ type: "success", message: "✅ Credenciales correctas" });
      } else {
        setStatus({ type: "error", message: "❌ Credenciales incorrectas" });
      }
    } catch {
      setStatus({ type: "error", message: "⚠️ Error de conexión" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentUser) navigate("/dashboard", { replace: true });
  }, [currentUser, navigate]);

  // Animaciones simplificadas y coordinadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
      },
    },
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden items-center justify-center bg-cover bg-center relative bg-gray-900"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/img/fondo-login.jpg)`,
      }}
    >
      {/* Efectos decorativos optimizados para móviles */}
      <motion.div
        className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-[#6802C1]/30 rounded-full blur-xl sm:blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 sm:w-60 sm:h-60 bg-[#FB4141]/20 rounded-full blur-xl sm:blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-12 sm:px-10 sm:py-16 rounded-2xl sm:rounded-3xl shadow-2xl w-[90%] max-w-md mx-4 sm:mx-0 z-10"
      >
        <motion.div
          className="flex flex-col items-center mb-8 sm:mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-xl sm:text-2xl font-bold text-white text-center"
          >
            Bienvenido a <br />
            <span
              translate="no"
              className="text-[#6802C1] text-3xl sm:text-4xl tracking-wide block mt-2 drop-shadow-[0_2px_2px_rgba(1,1,0,0.6)]"
            >
              <Typewriter
                text="Universidad Continental"
                delay={20}
                className="whitespace-pre"
              />
            </span>
          </motion.h2>
          <motion.div
            className="h-1 w-20 sm:w-24 bg-[#6802C1] mt-3 sm:mt-4 rounded-full"
            variants={itemVariants}
          />
        </motion.div>

        <form className="space-y-6 sm:space-y-8">
          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm font-medium shadow-sm ${
                  status.type === "success"
                    ? "bg-green-500/20 border border-green-500 text-green-200"
                    : "bg-[#FB4141]/20 border border-[#FB4141] text-[#FB4141]"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    status.type === "success" ? faCheckCircle : faTimesCircle
                  }
                  className="text-base sm:text-lg"
                />
                <span className="flex-1">{status.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="flex rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-[#6802C1]/60 transition-all">
              <div className="w-12 sm:w-14 bg-[#6802C1] flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white text-lg sm:text-xl"
                />
              </div>
              <input
                type="email"
                placeholder="Correo institucional"
                className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-[#DFE1E0] text-black font-medium placeholder-[#5A5A5A] focus:outline-none text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-[#6802C1]/60 transition-all">
              <div className="w-12 sm:w-14 bg-[#6802C1] flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faLock}
                  className="text-white text-lg sm:text-xl"
                />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-[#DFE1E0] text-black font-medium placeholder-[#5A5A5A] focus:outline-none text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={checkCredentials}
            disabled={isSubmitting}
            className="w-full py-3 sm:py-4 bg-[#6802C1] text-white font-semibold text-base sm:text-lg rounded-lg sm:rounded-xl shadow-md hover:bg-[#5701a3] transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Ingresando...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
