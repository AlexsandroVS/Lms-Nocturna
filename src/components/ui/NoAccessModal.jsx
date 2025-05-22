/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function NoAccessModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0  backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
                <FontAwesomeIcon icon={faLock} className="text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Acceso Denegado
              </h2>
              <p className="text-gray-600 text-sm">
                No estás inscrito en este curso. Pide acceso a tu docente o administrador.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
