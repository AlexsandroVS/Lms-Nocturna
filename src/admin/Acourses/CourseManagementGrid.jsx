/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { CourseCard } from "../../components/courses/CoursesCard";
import { EditCourseModal } from "../modals/EditCourseModal";
import { DeleteCourseModal } from "../modals/DeleteCourseModal";

export const CourseManagementGrid = ({ filterStatus = "all" }) => {
  const { api } = useAuth(); // Conexión API desde AuthContext

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cargar lista de cursos al montar
  useEffect(() => {
    fetchCourses();
  }, []);

  // Obtener cursos desde la API
  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/courses"); 
      // Se asume que el backend devuelve un arreglo de cursos con campos como {id, title, state, ...}
      setCourses(response.data);
    } catch (err) {
      console.error("Error al obtener cursos:", err);
      setError("Error al obtener la lista de cursos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cursos según el estado seleccionado
  const filteredCourses = courses.filter((course) => {
    if (filterStatus === "all") return true;
    return course.state === filterStatus;
  });

  // Manejo de guardado de curso (al editar)
  const handleSaveCourse = async (updatedCourse) => {
    try {
      // Llamada PUT para actualizar el curso
      await api.put(`/courses/${updatedCourse.id}`, updatedCourse);
      // Volver a cargar la lista de cursos
      fetchCourses();
    } catch (err) {
      console.error("Error al actualizar curso:", err);
      // Aquí puedes manejar la notificación de error
    }
  };

  // Manejo de eliminación de curso
  const handleDeleteCourse = async (courseId) => {
    try {
      // Llamada DELETE para eliminar el curso
      await api.delete(`/courses/${courseId}`);
      // Volver a cargar la lista
      fetchCourses();
    } catch (err) {
      console.error("Error al eliminar curso:", err);
      // Aquí puedes manejar la notificación de error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 overflow-y-auto h-[700px] flex flex-col rounded-xl shadow-sm border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Gestión de Cursos</h3>
        <span className="text-gray-500">
          {filteredCourses.length} de {courses.length} cursos
        </span>
      </div>

      {/* Muestra estado de carga o error */}
      {loading && <p className="text-gray-600">Cargando cursos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!loading && !error && filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <CourseCard course={course} />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Botón de editar */}
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setShowEditModal(true);
                }}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
              >
                ✏️
              </button>
              {/* Botón de eliminar */}
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setShowDeleteModal(true);
                }}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50"
              >
                🗑️
              </button>
            </div>

            {/* Badge de estado */}
            <span
              className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full ${
                course.state === "active"
                  ? "bg-green-100 text-green-800"
                  : course.state === "inactive"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {course.state === "active" && "Activo"}
              {course.state === "inactive" && "Inactivo"}
              {course.state === "archived" && "Archivado"}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Modal de edición */}
      {showEditModal && selectedCourse && (
        <EditCourseModal
          course={selectedCourse}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveCourse}
        />
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && selectedCourse && (
        <DeleteCourseModal
          course={selectedCourse}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={(courseId) => {
            handleDeleteCourse(courseId);
            setShowDeleteModal(false);
          }}
        />
      )}
    </motion.div>
  );
};
