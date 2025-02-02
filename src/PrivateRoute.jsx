/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Ruta base para usuarios autenticados
export const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

// Ruta solo para administradores
export const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  return currentUser && isAdmin ? children : <Navigate to="/dashboard" />;
};
