  /* eslint-disable no-unused-vars */
  /* eslint-disable react/prop-types */
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
  import fondoLogin from "../assets/fondo-login.jpg";
  import logoRojo from "../assets/logo.png";

  function Login() {
    const navigate = useNavigate();
    const { login, finalizeLogin, currentUser } = useAuth();
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

      // Se ejecutará `checkCredentials` solo si el usuario deja de escribir por 1 segundo
      timerRef.current = setTimeout(() => {
        checkCredentials();
      }, 1000);

      return () => clearTimeout(timerRef.current);
    }, [email, password]);

    const checkCredentials = async () => {
      setIsSubmitting(true);
    
      try {
        const response = await login(email, password);
        if (response.success) {
          setStatus({ type: "success", message: "✅ Credenciales correctas" });

          // Esperar 1 segundo para mostrar el mensaje antes de actualizar el estado global
          setTimeout(() => finalizeLogin(response.user), 1000);
        } else {
          setStatus({ type: "error", message: "❌ Credenciales incorrectas" });
        }
      } catch (error) {
        setStatus({ type: "error", message: "⚠️ Error de conexión" });
      } finally {
        setIsSubmitting(false);
      }
    };

    useEffect(() => {
      if (currentUser) {
        navigate("/dashboard", { replace: true });
      }
    }, [currentUser, navigate]);


    const getInputStyle = () => {
      if (!email || !password) return "";
      return status.type === "error"
        ? "ring-2 ring-red-500 ring-opacity-50"
        : status.type === "success"
        ? "ring-2 ring-green-500 ring-opacity-50"
        : "";
    };

    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${fondoLogin})`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 relative p-8 rounded-2xl shadow-2xl w-96 min-h-[480px] flex flex-col justify-center"
        >
          <div className="flex justify-center mb-10">
            <img src={logoRojo} alt="Logo" className="h-24 rounded-xl" />
          </div>

          <form className="space-y-8">
            <AnimatePresence>
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    status.type === "success"
                      ? "bg-green-500/20 border border-green-500"
                      : "bg-red-500/20 border border-red-500"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={status.type === "success" ? faCheckCircle : faTimesCircle}
                    className={`text-xl ${
                      status.type === "success" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      status.type === "success" ? "text-green-200" : "text-red-200"
                    }`}
                  >
                    {status.message}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={`flex rounded-xl overflow-hidden shadow-sm ${getInputStyle()}`}>
                <div className="w-14 bg-[#d62828] flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-white text-xl" />
                </div>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="flex-1 px-4 py-3 bg-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={`flex rounded-xl overflow-hidden shadow-sm ${getInputStyle()}`}>
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
          </form>
        </motion.div>
      </div>
    );
  }

  export default Login;
