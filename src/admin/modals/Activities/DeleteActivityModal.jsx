/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const DeleteActivityModal = ({ activity, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Icono de advertencia */}
        <div className="flex items-center justify-center text-red-500 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-red-600 text-center mb-4">
          Eliminar Actividad
        </h2>

        {/* Mensaje de confirmación */}
        <p className="text-gray-700 text-center">
          ¿Estás seguro de que deseas eliminar la actividad{" "}
          <strong>{activity.Title}</strong>? Esta acción no se puede deshacer.
        </p>

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-4">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={() => onConfirm(activity.ActivityID)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Eliminar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteActivityModal;
