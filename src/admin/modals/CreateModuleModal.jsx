/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faSpinner, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";

export const CreateModuleModal = ({ courseId, onClose, onSave }) => {
  const { api } = useAuth();
  const [title, setTitle] = useState("");
  const [moduleOrder, setModuleOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [modulesCount, setModulesCount] = useState(0);

  // Obtener la cantidad de módulos existentes para el curso
  useEffect(() => {
    const fetchModulesCount = async () => {
      try {
        const response = await api.get(`/courses/${courseId}/modules`);
        setModulesCount(response.data.length);
        // Establecer el orden por defecto como el siguiente número disponible
        setModuleOrder(String(response.data.length + 1));
      } catch (error) {
        console.error("Error al obtener módulos:", error);
      }
    };

    fetchModulesCount();
  }, [courseId, api]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
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
        moduleOrder: moduleOrder ? Number(moduleOrder) : modulesCount + 1 
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
                  className="text-purple-600 bg-blue-100 p-2 rounded-lg"
                />
                Nuevo Módulo
              </h2>
              <p className="text-sm text-gray-500 mt-1">Agrega un nuevo módulo al curso</p>
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
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-0 focus:ring-purple-500 focus:border-transparent"
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
                min={1}
                value={moduleOrder}
                onChange={(e) => setModuleOrder(e.target.value)}
                placeholder={`Ej: ${modulesCount + 1}`}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-0 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {modulesCount > 0 
                  ? `Actualmente hay ${modulesCount} módulo(s) en este curso`
                  : "Este será el primer módulo del curso"}
              </p>
            </div>

            {/* Botones */}
            <div className="pt-6 flex justify-end gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                disabled={!title || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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