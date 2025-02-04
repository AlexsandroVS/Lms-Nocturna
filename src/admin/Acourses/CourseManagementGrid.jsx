/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { CourseCard } from "../../components/courses/CoursesCard";
import { EditCourseModal } from "../modals/EditCourseModal";
import { DeleteCourseModal } from "../modals/DeleteCourseModal";
import coursesData from "../../data/courses";

export const CourseManagementGrid = ({ filterStatus = "all" }) => {
  const [courses, setCourses] = useState(coursesData);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filtrar cursos según el estado seleccionado
  const filteredCourses = courses.filter((course) => {
    if (filterStatus === "all") return true;
    return course.state === filterStatus;
  });

  const handleSaveCourse = (updatedCourse) => {
    setCourses(
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 overflow-y-auto h-[700px] flex flex-col rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Gestión de Cursos</h3>
        <span className="text-gray-500">
          {filteredCourses.length} de {courses.length} cursos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <CourseCard course={course} />
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setSelectedCourse(course);
                  setShowEditModal(true);
                }}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
              >
                ✏️
              </button>
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

      {showEditModal && (
        <EditCourseModal
          course={selectedCourse}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveCourse}
        />
      )}

      {showDeleteModal && (
        <DeleteCourseModal
          course={selectedCourse}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCourse}
        />
      )}
    </motion.div>
  );
};
