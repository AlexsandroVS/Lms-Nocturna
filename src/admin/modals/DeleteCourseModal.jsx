/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export const DeleteCourseModal = ({ course, onClose, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-8 w-full max-w-lg relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
        </button>

        <div className="text-center space-y-4">
          <div className="mx-auto w-fit p-4 bg-red-50 rounded-full">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-red-600 text-5xl"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            ¿Eliminar curso permanentemente?
          </h2>

          <p className="text-gray-600 text-lg">
            Estás eliminando el curso:{" "}
            <span className="font-semibold text-red-600 block mt-2">
              {course.title}
            </span>
          </p>

          <div className="pt-6 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(course.id);
                onClose();
              }}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow-red-200"
            >
              Confirmar Eliminación
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
