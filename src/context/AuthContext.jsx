/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    const userWithRole = {
      ...userData,
      role: userData.email === "admin@example.com" ? "admin" : "user",
    };

    localStorage.setItem("user", JSON.stringify(userWithRole));
    localStorage.setItem("authToken", "fake-token"); // Almacenar el token
    setUser(userWithRole);

    // Redirigir según el rol
    const redirectPath =
      userWithRole.role === "admin" ? "/admin/dashboard" : "/dashboard";
    navigate(redirectPath);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken"); // Eliminar el token
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
