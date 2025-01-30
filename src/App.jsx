import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/layout/Navbar";
import Courses from "./pages/Courses";

const App = () => {
  
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  function Loader() {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#d62828] flex items-center justify-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity 
          }}
          className="h-16 w-16 border-4 border-[#fcbf49] border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const DashboardLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-white shadow-lg rounded-lg mx-4 my-6">
        {children}
      </main>
    </div>
  );

  return (
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
            <Route 
              path="/" 
              element={<Login onLogin={handleLogin} />} 
            />
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
          </Routes>
        )}
      </div>
    </AnimatePresence>
  );
};

export default App;