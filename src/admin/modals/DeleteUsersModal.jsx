/* eslint-disable react/prop-types */
// src/admin/modals/DeleteUsersModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faExclamationTriangle, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DeleteUsersModal = ({ user, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await onConfirm(user);
    } catch (err) {
      console.error(err);
      setError("Error al eliminar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-white/20">
      <motion.div
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.8, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Estás seguro?</h2>
          <p className="text-gray-600 text-center">
            Esta acción eliminará permanentemente al usuario <span className="font-semibold">{user.name}</span>.
          </p>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <div className="mt-6 flex justify-end space-x-4">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Eliminando..." : (
              <>
                <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                Eliminar
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteUsersModal;
