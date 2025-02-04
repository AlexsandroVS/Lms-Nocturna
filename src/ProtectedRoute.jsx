import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
// eslint-disable-next-line no-unused-vars
import Navbar from "./components/layout/Navbar";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ roles = [], layout: Layout = ({ children }) => children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
