import { useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

function useLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validación de formato
  const validateFormat = useCallback(() => {
    const isEmailEmpty = email === "";
    const isPasswordEmpty = password === "";

    if (isEmailEmpty && isPasswordEmpty) {
      setStatus({ type: null, message: "" });
      return false;
    }

    const emailValid = isEmailEmpty
      ? true
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = isPasswordEmpty ? true : password.length >= 6;
    const valid = emailValid && passwordValid;

    const errorMessages = [];
    if (!isEmailEmpty && !emailValid)
      errorMessages.push("El correo debe contener @");
    if (!isPasswordEmpty && !passwordValid)
      errorMessages.push("La contraseña debe tener al menos 6 caracteres");

    if (errorMessages.length > 0) {
      setStatus({ type: "error", message: errorMessages.join(", ") });
    } else {
      setStatus({ type: "success", message: "Formato válido" });
    }

    return valid;
  }, [email, password]);

  // Función para manejar el inicio de sesión
  const handleLogin = useCallback(async () => {
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const success = await login(email, password);
      if (success) {
        setStatus({ type: "success", message: "Credenciales verificadas" });
        return true; // Autenticación exitosa
      } else {
        setStatus({ type: "error", message: "Credenciales incorrectas" });
        return false; // Autenticación fallida
      }
    } catch (error) {
      setStatus({ type: "error", message: "Error de conexión" });
      return false; // Error en la solicitud
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, login]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    status,
    isSubmitting,
    validateFormat,
    handleLogin,
  };
}

export default useLogin;
