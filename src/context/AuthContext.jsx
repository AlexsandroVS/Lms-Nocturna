/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

// Configurar axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ["/login", "/register", "/"];
    if (!publicRoutes.includes(location.pathname)) {
      initializeAuth();
    } else {
      setLoading(false); // Evitar pantalla de carga infinita
    }
  }, [location.pathname]);

  const initializeAuth = async () => {
    try {
      const response = await api.get("/auth/me"); // Se basa en la cookie HTTP Only
      if (response.data.user) {
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error autenticando:", error.response?.data);
      }
      setCurrentUser(null); // Usuario no autenticado
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  const updateToken = (newToken) => {
    // Si usas cookies no HTTPOnly, guarda el token así:
    document.cookie = `token=${newToken}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; secure; samesite=strict`;

    // O guarda en localStorage si prefieres:
    // localStorage.setItem("token", newToken);

    // Si necesitas actualizar currentUser a partir del token:
    const payload = JSON.parse(atob(newToken.split(".")[1]));
    setCurrentUser((prev) => ({
      ...prev,
      email: payload.email, // opcional, según qué datos metas en el JWT
    }));
  };

  const updateUserAvatar = (newAvatar) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      avatar: newAvatar.startsWith("http")
        ? newAvatar
        : `http://localhost:5000${newAvatar}`,
    }));

    const updatedUser = {
      ...JSON.parse(localStorage.getItem("userData")),
      avatar: newAvatar,
    };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password }); // withCredentials ya configurado
      const { user } = response.data;

      setCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      let errorMessage = "Error de conexión. Inténtalo de nuevo.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Credenciales incorrectas";
        } else {
          errorMessage = error.response.data.error || "Error inesperado";
        }
      }
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error en logout backend:", error);
    } finally {
      localStorage.removeItem("userData");
      setCurrentUser(null);
      // ⚠️ Usa recarga total para evitar estados en blanco
      window.location.href = "/login";
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    login,
    updateUserAvatar,
    updateToken,
    logout,
    isAdmin: currentUser?.role === "admin",
    isTeacher: currentUser?.role === "teacher",
    isStudent: currentUser?.role === "student",
    api,
    loading, // Para indicar si aún estamos cargando los datos del usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
