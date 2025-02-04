import { useState } from "react";
import { motion } from "framer-motion";
import { CourseProgressChart } from "./CourseProgressChart";
import { EnrollmentStats } from "./EnrollmentStats";
import { CourseManagementGrid } from "./CourseManagementGrid";
import { LearningAnalytics } from "./LearningAnalytics";
import { CreateCourseModal } from "../modals/CreateCourseModal";

const AdminCoursesDashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSave={(newCourse) => {
            // Lógica para guardar el nuevo curso
            console.log("Nuevo curso:", newCourse);
            setShowCreateModal(false);
          }}
        />
      )}
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
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Curso
          </button>

          {/* Filtro de estado */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="archived">Archivados</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
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
