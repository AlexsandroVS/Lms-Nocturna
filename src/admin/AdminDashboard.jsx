// components/admin/AdminDashboard.jsx
import { motion } from "framer-motion";
import AdminStats from "./AdminStats";
import UserManagementTable from "./UserManagementTable";
import CourseManagement from "./CourseManagement";

export default function AdminDashboard() {
  // Datos simulados para las métricas
  const metrics = [
    { title: "Usuarios Activos", value: "1,234", change: "+5%" },
    { title: "Cursos Publicados", value: "45", change: "+12%" },
    { title: "Ingresos Mensuales", value: "$12,345", change: "+8%" },
  ];

  return (
    <div className="space-y-8">
      {/* Bienvenida para el admin */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-indigo-50 p-6 rounded-xl shadow-lg border-l-4 border-indigo-500"
      >
        <h1 className="text-2xl font-bold text-indigo-800 mb-2">
          Panel de Administración
        </h1>
        <p className="text-indigo-600">
          Bienvenido al centro de control de la plataforma. Aquí puedes
          gestionar todos los aspectos del sistema.
        </p>
      </motion.div>

      {/* Estadísticas */}
      <AdminStats metrics={metrics} />

      {/* Tabla de usuarios y gestión de cursos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserManagementTable />
        <CourseManagement />
      </div>
    </div>
  );
}
