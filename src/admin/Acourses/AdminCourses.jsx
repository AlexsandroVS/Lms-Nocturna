// components/admin/AdminCoursesDashboard.jsx
import { motion } from "framer-motion";
import { CourseProgressChart } from "./CourseProgressChart";
import { EnrollmentStats } from "./EnrollmentStats";
import { CourseManagementGrid } from "./CourseManagementGrid";
import { LearningAnalytics } from "./LearningAnalytics";

const AdminCoursesDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-start gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Cursos</h1>
          <p className="text-gray-600 mt-2">Gestión académica integral</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Nuevo Curso
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
            Filtrar
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección izquierda - Estadísticas principales */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <CourseProgressChart />
            <EnrollmentStats />
          </motion.div>

          <CourseManagementGrid />
        </div>

        {/* Sección derecha - Analytics y Acciones */}
        <div className="space-y-8">
          <LearningAnalytics />

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                Publicar nuevo contenido
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                Generar certificados
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors">
                Revisar feedback
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesDashboard;
