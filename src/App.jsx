import { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/layout/Navbar";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage";
import Loader from "./components/ui/Loader";
import ProfilePage from "./pages/ProfilePage";
import ActivityPage from "./pages/ActivityPage";
import FilesPage from "./pages/FilesPage";
import AdminDashboard from "./admin/AdminDashboard";

const DashboardLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 p-6 mt-24 bg-white shadow-lg rounded-lg mx-4 my-6"
    >
      {children}
    </motion.main>
  </div>
);

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthProvider>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #f7fafc, #edf2f7)",
        }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Loader key="loader" />
          ) : (
            <Routes location={location} key={location.key}>
              <Route path="/" element={<Login setIsLoading={setIsLoading} />} />

              {/* Rutas protegidas con DashboardLayout */}
              <Route element={<ProtectedRoute layout={DashboardLayout} />}>
                <Route
                  path="/dashboard"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <Dashboard />
                    </motion.div>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <Courses />
                    </motion.div>
                  }
                />
                <Route
                  path="/courses/:courseId/modules/:moduleId"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <ActivityPage />
                    </motion.div>
                  }
                />

                <Route
                  path="/courses/:id"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <CoursePage />
                    </motion.div>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <ProfilePage />
                    </motion.div>
                  }
                />
                <Route
                  path="/files/:activityId"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <FilesPage />
                    </motion.div>
                  }
                />
              </Route>

              {/* Rutas de administrador */}
              <Route
                element={
                  <ProtectedRoute roles={["admin"]} layout={DashboardLayout} />
                }
              >
                <Route
                  path="/admin"
                  element={
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                    >
                      <AdminDashboard />
                    </motion.div>
                  }
                />
              </Route>

              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
};

export default App;
