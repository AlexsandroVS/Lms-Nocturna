/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPlus,
  faSpinner,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

export const CreateModuleModal = ({ courseId, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [moduleOrder, setModuleOrder] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      setTitle("");
      setModuleOrder("");
      setLoading(false);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        courseId,
        title,
        moduleOrder: moduleOrder ? Number(moduleOrder) : null,
      });
      onClose();
    } catch (error) {
      console.error("Error al crear módulo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Encabezado */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="text-blue-600 bg-blue-100 p-2 rounded-lg"
                />
                Nuevo Módulo
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Agrega un nuevo módulo al curso
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título del módulo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Introducción al curso"
                className="w-full p-3 border-1 border-slate-300 focus:outline-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Orden */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Orden de visualización
                <span className="text-gray-400 ml-1">(opcional)</span>
              </label>
              <input
                type="number"
                min={0}
                value={moduleOrder}
                onChange={(e) => setModuleOrder(e.target.value)}
                placeholder="Ej: 1"
                className="w-full p-3  border-1 border-slate-300 focus:outline-0  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botones */}
            <div className="pt-6 flex justify-center gap-3">
              {/* Botón Cancelar - estilo rojo */}
              <motion.button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 transition-all font-medium"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancelar
              </motion.button>

              {/* Botón Crear - estilo azul */}
              <motion.button
                type="submit"
                disabled={!title || loading}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium flex items-center gap-2 transition-all duration-300 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-lg" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} />
                    Crear Módulo
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
