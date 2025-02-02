import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import courses from "../data/courses";
import Header from "../components/layout/Header";
import AcademicProgress from "../components/dashboard/AcademicProgress";
import ContinueCourse from "../components/dashboard/ContinueCourse";
import CriticalDeadlines from "../components/dashboard/CriticalDeadlines";
import FeaturedResource from "../components/dashboard/FeaturedResource";
import AdminDashboard from "../admin/AdminDashboard";

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth(); // Obtén el usuario actual y su rol

  // Componente de bienvenida
  function WelcomeCard() {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-[#d62828]"
      >
        <h1 className="text-3xl font-bold mb-2 text-[#003049]">
          ¡Buenas noches, {currentUser?.name || "Usuario"}!
        </h1>
        <p className="text-gray-600 text-xl">
          ¡Bienvenido a nuestra plataforma de aprendizaje! Nos alegra mucho
          tenerte aquí y esperamos que disfrutes esta experiencia.
        </p>
      </motion.div>
    );
  }

  // Renderizado condicional
  return (
    <div className="flex-1 p-8">
      <Header />
      {isAdmin ? (
        // Si el usuario es admin, renderiza el AdminDashboard
        <AdminDashboard />
      ) : (
        // Si no es admin, renderiza el dashboard normal
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WelcomeCard />
            <AcademicProgress
              courses={courses.map(({ title, progress, color }) => ({
                name: title,
                progress,
                color,
              }))}
            />
          </div>

          <ContinueCourse />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CriticalDeadlines />
            <FeaturedResource />
          </div>
        </div>
      )}
    </div>
  );
}
