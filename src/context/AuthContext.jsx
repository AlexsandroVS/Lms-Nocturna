import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Configurar axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth(); // Llamar a initializeAuth en un solo efecto
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  const initializeAuth = async () => {
    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("jwtToken");

    if (userData && token) {
      setCurrentUser(JSON.parse(userData)); // Establecer el usuario desde localStorage

      try {
        const response = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Si la respuesta es exitosa, actualizar el estado `currentUser` y `localStorage`
        if (response.data.user) {
          const user = response.data.user;
          setCurrentUser(user);
          localStorage.setItem("userData", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error.response?.data);
        if (error.response?.status === 401) {
          await logout(); // Si el token es inválido, se cierra la sesión
        }
      }
    } else {
      await logout(); // Si no se encuentran los datos, desloguear
    }

    setLoading(false); // Cambiar el estado de carga
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
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      // Almacenar el token y los datos del usuario
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      setCurrentUser(user); // Establecer el usuario en el estado

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
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userData");
      setCurrentUser(null);
      navigate("/", { replace: true });
    }
  };

  // Interceptor para incluir el token en todas las peticiones
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const value = {
    currentUser,
    setCurrentUser,
    login,
    updateUserAvatar,
    logout,
    isAdmin: currentUser?.role === "admin",
    isTeacher: currentUser?.role === "teacher",
    api,
    loading, // Para indicar si aún estamos cargando los datos del usuario
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
