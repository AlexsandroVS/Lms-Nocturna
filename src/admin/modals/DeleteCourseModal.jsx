/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";

export const DeleteCourseModal = ({ course, onClose, onConfirm }) => {
  if (!course) return null;

  const handleConfirm = () => {
    // Llamar a onConfirm con el id del curso
    onConfirm(course.id);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-6 w-full max-w-sm relative shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
        </button>

        <div className="flex items-center justify-center text-red-500 mb-4">
          <FontAwesomeIcon icon={faTrash} className="text-3xl" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Eliminar Curso
        </h2>
        <p className="text-center text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar el curso "<strong>{course.title}</strong>"?
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
