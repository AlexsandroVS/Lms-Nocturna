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
import Typewriter from "../components/ui/Typewriter"

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
      className="min-h-screen flex overflow-hidden items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/img/fondo-login.jpg)`,
      }}
    >
      {/* Efectos decorativos simplificados */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-[#6802C1]/30 rounded-full blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 bg-[#FB4141]/20 rounded-full blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-24 rounded-3xl shadow-2xl w-full max-w-md z-10"
      >
        <motion.div
          className="flex flex-col items-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-white text-center"
          >
            Bienvenido a <br />
            <span translate="no" className="text-[#6802C1] text-4xl tracking-wide block mt-2 drop-shadow-[0_2px_2px_rgba(1,1,0,0.6)]">
            <Typewriter 
              text="Universidad Continental" 
              delay={20} 
              className="whitespace-pre"
            />
          </span>
          </motion.h2>
          <motion.div
            className="h-1 w-24 bg-[#6802C1] mt-4 rounded-full"
            variants={itemVariants}
          />
        </motion.div>

        {/* Resto del código permanece igual */}
        <form className="space-y-8">
          <AnimatePresence>
            {status.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm ${
                  status.type === "success"
                    ? "bg-green-500/20 border border-green-500 text-green-200"
                    : "bg-[#FB4141]/20 border border-[#FB4141] text-[#FB4141]"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    status.type === "success" ? faCheckCircle : faTimesCircle
                  }
                  className="text-lg"
                />
                {status.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="flex rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-[#6802C1]/60 transition-all">
              <div className="w-14 bg-[#6802C1] flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white text-xl"
                />
              </div>
              <input
                type="email"
                placeholder="Correo institucional"
                className="flex-1 px-5 py-4 bg-[#DFE1E0] text-black font-medium placeholder-[#5A5A5A] focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex rounded-xl overflow-hidden shadow-lg hover:ring-2 hover:ring-[#6802C1]/60 transition-all">
              <div className="w-14 bg-[#6802C1] flex items-center justify-center">
                <FontAwesomeIcon icon={faLock} className="text-white text-xl" />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                className="flex-1 px-5 py-4 bg-[#DFE1E0] text-black font-medium placeholder-[#5A5A5A] focus:outline-none"
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
            className="w-full py-4 bg-[#6802C1] text-white font-semibold text-lg rounded-xl shadow-md hover:bg-[#5701a3] transition-colors"
          >
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
