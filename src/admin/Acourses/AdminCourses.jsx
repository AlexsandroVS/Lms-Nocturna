/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { CreateCourseModal } from "../modals/CreateCourseModal";
import CoursesCard from "../../components/courses/CoursesCard";
import { EditCourseModal } from "../modals/EditCourseModal";
import { DeleteCourseModal } from "../modals/DeleteCourseModal";

const AdminCoursesDashboard = () => {
  const { api, currentUser, isTeacher } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]); // Nuevo estado para asignaciones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Obtener cursos y asignaciones en paralelo
      const [coursesRes, assignmentsRes] = await Promise.all([
        api.get("/courses"),
        api.get("/assignments")
      ]);

      setCourses(coursesRes.data);
      setAssignments(assignmentsRes.data);
    } catch (err) {
      setError("Error al obtener la lista de cursos");
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener cursos asignados al docente actual
  const getTeacherCourses = () => {
    if (!isTeacher || !currentUser?.id) return [];
    
    // 1. Obtener los AssignmentIDs de este docente
    const teacherAssignments = assignments.filter(
      a => a.TeacherID === currentUser.id
    );
    
    // 2. Obtener los CourseIDs de esas asignaciones
    const assignedCourseIds = teacherAssignments.map(a => a.CourseID);
    
    // 3. Filtrar los cursos que coincidan con esos IDs
    return courses.filter(course => 
      assignedCourseIds.includes(course.id) &&
      (selectedStatus === "all" || course.status === selectedStatus)
    );
  };

  // Obtener cursos para admin (todos) o docente (solo asignados)
  const getFilteredCourses = () => {
    if (isTeacher) {
      return getTeacherCourses();
    }
    return courses.filter(course => 
      selectedStatus === "all" || course.status === selectedStatus
    );
  };

  const handleSaveNewCourse = async (courseData) => {
    try {
      await api.post("/courses", courseData);
      await fetchData();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error al crear curso:", err);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleSaveEdit = async (formPayload) => {
    try {
      const response = await api.put(
        `/courses/${formPayload.get("id")}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchData();
      setEditingCourse(null);
    } catch (err) {
      console.error("Detalles del error:", {
        error: err.response?.data || err.message,
        status: err.response?.status,
      });
    }
  };

  const handleDelete = (course) => {
    setDeletingCourse(course);
  };

  const handleConfirmDelete = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      await fetchData();
      setDeletingCourse(null);
    } catch (err) {
      console.error("Error al eliminar curso:", err);
    }
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="min-h-screen bg-[] p-4 sm:p-6 lg:p-8">
      {/* Modales - Ocultar modal de creación para docentes */}
      {!isTeacher && showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveNewCourse}
          currentUserId={currentUser?.id}
        />
      )}
      {!isTeacher && editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveEdit}
        />
      )}
      {!isTeacher && deletingCourse && (
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
            {isTeacher ? "Mis Cursos" : "Panel de Cursos"}
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isTeacher ? "Cursos asignados a ti" : "Administra los cursos existentes"}
          </p>
        </div>
        
        {!isTeacher && (
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
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
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

            {/* Botón nuevo curso - Solo para admin */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
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
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Contenido Principal */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-4 shadow animate-pulse h-64"
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
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
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
                      isAdmin={!isTeacher} // Pasar si es admin para mostrar acciones
                      onEdit={!isTeacher ? handleEdit : null} // Ocultar edición para docentes
                      onDelete={!isTeacher ? handleDelete : null} // Ocultar eliminación para docentes
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                {isTeacher ? "No tienes cursos asignados" : "No hay cursos disponibles"}
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default AdminCoursesDashboard;