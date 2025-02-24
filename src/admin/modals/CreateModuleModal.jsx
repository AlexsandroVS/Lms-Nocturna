/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons";

export const CreateModuleModal = ({ courseId, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Resetear el estado al cerrar el modal
      setTitle("");
      setOrder("");
      setLoading(false);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({ courseId, title, order: order ? Number(order) : null });
      onClose(); // Cerrar modal después de guardar
    } catch (error) {
      console.error("Error al crear módulo:", error);
    } finally {
      setLoading(false);
    }
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
        className="bg-[#1E293B] text-white rounded-xl p-5 w-full max-w-md relative shadow-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            <FontAwesomeIcon icon={faPlus} className="mr-2 text-indigo-400" />
            Crear Módulo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título del módulo
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-[#2D3748] text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: Introducción, Configuración..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Orden (opcional)
            </label>
            <input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-[#2D3748] text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: 1"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title || loading}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center"
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Crear"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
