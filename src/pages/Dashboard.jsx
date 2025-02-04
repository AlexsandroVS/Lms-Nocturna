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
  const { currentUser, isAdmin, loading } = useAuth(); // Agregamos `loading` para manejar la carga

  // Función para obtener un saludo dinámico
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días";
    if (hour < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  // Componente de bienvenida
  function WelcomeCard() {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-[#d62828]"
      >
        <h1 className="text-3xl font-bold mb-2 text-[#003049]">
          {getGreeting()}, {currentUser?.name || "Usuario"}!
        </h1>
        <p className="text-gray-600 text-xl">
          ¡Bienvenido a nuestra plataforma de aprendizaje! Nos alegra mucho
          tenerte aquí y esperamos que disfrutes esta experiencia.
        </p>
      </motion.div>
    );
  }

  // 📌 Muestra un loader si aún está cargando la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  // 📌 Si `currentUser` no está definido después de cargar, redirigir al login (opcional)
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">Error: No se pudo cargar el usuario.</p>
      </div>
    );
  }

  // 📌 Renderizado condicional del Dashboard
  return (
    <div className="flex-1 p-8">
      <Header />
      {isAdmin ? (
        <AdminDashboard />
      ) : (
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
