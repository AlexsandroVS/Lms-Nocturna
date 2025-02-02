/* eslint-disable react/prop-types */
// components/admin/DeleteConfirmationModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, userName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Fondo con efecto glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Contenido del modal */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="text-red-600 text-xl"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              ¿Eliminar usuario permanentemente?
            </h3>

            {userName && (
              <p className="text-gray-600 text-center mb-6">
                Estás a punto de eliminar a:
                <br />
                <span className="font-medium text-gray-900">{userName}</span>
              </p>
            )}

            <p className="text-red-600 text-sm text-center mb-6">
              Esta acción no se puede deshacer y todos los datos asociados serán
              eliminados.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirmar eliminación
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
