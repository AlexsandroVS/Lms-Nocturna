import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import CreateCourseModal from "../modals/CreateCourseModal";
import CoursesCard from "../../components/courses/CoursesCard";

// Importar los dos modales nuevos
import { EditCourseModal } from "../modals/EditCourseModal";
import { DeleteCourseModal } from "../modals/DeleteCourseModal";

const AdminCoursesDashboard = () => {
  const { api, currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Estados para editar y eliminar
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (err) {
      setError("Error al obtener la lista de cursos");
      console.error("Error al obtener cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo curso
  const handleSaveNewCourse = async (courseData) => {
    try {
      await api.post("/courses", courseData);
      await fetchCourses();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error al crear curso:", err);
    }
  };

  // Abrir modal de edición
  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  // Guardar cambios del modal de edición
  const handleSaveEdit = async (updatedCourse) => {
    try {
      await api.put(`/courses/${updatedCourse.id}`, updatedCourse);
      await fetchCourses();
      setEditingCourse(null); // Cerrar modal
    } catch (err) {
      console.error("Error al editar curso:", err);
    }
  };

  // Abrir modal de eliminación
  const handleDelete = (course) => {
    setDeletingCourse(course);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      await fetchCourses();
      setDeletingCourse(null);
    } catch (err) {
      console.error("Error al eliminar curso:", err);
    }
  };

  // Filtrar cursos según estado seleccionado
  const filteredCourses = courses.filter(
    (course) => selectedStatus === "all" || course.status === selectedStatus
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Modales */}
      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveNewCourse}
          currentUserId={currentUser?.id}
        />
      )}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveEdit}
        />
      )}
      {deletingCourse && (
        <DeleteCourseModal
          course={deletingCourse}
          onClose={() => setDeletingCourse(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Panel de Cursos
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Administra los cursos existentes
          </p>
        </div>
        <div className="flex flex-col gap-3 xs:flex-row xs:items-center">
          {/* Filtro */}
          <div className="relative flex-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer appearance-none"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="archived">Archivados</option>
              <option value="draft">Borradores</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Botón nuevo curso */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Curso
          </motion.button>
        </div>
      </motion.div>

      {/* Contenido Principal */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-4 shadow-md h-64 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center"
          >
            {error}
          </motion.div>
        ) : (
          <AnimatePresence>
            {/* Grid de cursos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-auto overflow-auto h-[500px] gap-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CoursesCard
                    course={course}
                    isAdmin={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminCoursesDashboard;
