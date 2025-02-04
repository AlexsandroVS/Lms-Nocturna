/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Configurar axios para usar la URL base y enviar el token automáticamente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('jwtToken');
    
    if (token) {
      try {
        // Verificar token con el backend
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCurrentUser(response.data.user);
      } catch (error) {
        handleAuthError(error);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Almacenar token y datos básicos del usuario
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      setCurrentUser(user);
      navigate(user.role === 'admin' ? '/dashboard' : '/');
      return true;
    } catch (error) {
      handleAuthError(error);
      return false;
    }
  };

  const logout = () => {
    // Limpiar almacenamiento
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
  
    // Primero redirigir al usuario
    navigate("/", { replace: true });
  
    // Luego limpiar el estado (esto previene posibles re-renderizados antes de la redirección)
    setTimeout(() => {
      setCurrentUser(null);
    }, 100);
  
    // Opcional: Llamar a endpoint de logout en el backend
    api.post('/auth/logout').catch((error) => console.error("Error en logout:", error));
  };
  

  const handleAuthError = (error) => {
    console.error('Error de autenticación:', error);
    
    if (error.response?.status === 401) {
      logout();
    }
  };

  // Interceptor para incluir token en cada petición
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin: currentUser?.role === 'admin',
    isTeacher: currentUser?.role === 'teacher',
    api // Exportar instancia de axios configurada
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};