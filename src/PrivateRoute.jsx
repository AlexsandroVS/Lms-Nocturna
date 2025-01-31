/* eslint-disable react/prop-types */
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // Verificar si hay un token en localStorage
  const authToken = localStorage.getItem("authToken");

  if (!authToken || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
