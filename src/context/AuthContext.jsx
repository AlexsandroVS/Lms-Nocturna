import { createContext, useContext, useState, useEffect } from "react";
import { users } from "../data/userData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password && u.isActive
    );

    if (user) {
      // Guardar TODOS los datos del usuario
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        permissions: user.permissions,
        stats: user.stats,
        achievements: user.achievements, // Incluir logros
        enrolledCourses: user.enrolledCourses, // Incluir cursos inscritos
        registrationDate: user.registrationDate, // Incluir fecha de registro
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin: currentUser?.role === "admin", // Verificación explícita
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
