import { useState } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/layout/Navbar";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import Loader from "./components/ui/Loader";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // eslint-disable-next-line react/prop-types
  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 mt-24 bg-white shadow-lg rounded-lg mx-4 my-6">
        {children}
      </main>
    </div>
  );

  // Componente para rutas protegidas
  const ProtectedRoute = () => {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet /> : <Navigate to="/" />;
  };

  // Componente para rutas de administrador
  const AdminRoute = () => {
    const { currentUser, isAdmin } = useAuth();
    return currentUser && isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
  };

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <div
          className="min-h-screen"
          style={{
            background: "linear-gradient(135deg, #f7fafc, #edf2f7)",
          }}
        >
          {isLoading ? (
            <Loader key="loader" />
          ) : (
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Login setIsLoading={setIsLoading} />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/dashboard"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 1.5 },
                      }}
                    >
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </motion.div>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 1.5 },
                      }}
                    >
                      <DashboardLayout>
                        <Courses />
                      </DashboardLayout>
                    </motion.div>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 1.5 } }}
                    >
                      <DashboardLayout>
                        <CoursePage />
                      </DashboardLayout>
                    </motion.div>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 1.5 } }}
                    >
                      <DashboardLayout>
                        <ProfilePage />
                      </DashboardLayout>
                    </motion.div>
                  }
                />

                {/* Rutas de administrador */}
              </Route>
            </Routes>
          )}
        </div>
      </AnimatePresence>
    </AuthProvider>
  );
};

export default App;
