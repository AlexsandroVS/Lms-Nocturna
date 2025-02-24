/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSave,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

// CreateActivityModal.jsx
const CreateActivityModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "pdf",
    file: null,
    deadline: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }
    if (!formData.file) {
      setError("El archivo es obligatorio.");
      return;
    }
    setError("");
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative"
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

        {/* Título */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Crear Nueva Actividad
        </h2>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Título de la actividad:
            </label>
            <input
              type="text"
              name="title"
              placeholder="Ejemplo: Introducción a HTML"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Descripción o instrucciones:
            </label>
            <textarea
              name="content"
              placeholder="Ejemplo: Lee el documento adjunto y responde las preguntas en clase."
              value={formData.content}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Subir Archivo PDF */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Archivo PDF:
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Fecha límite */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Fecha límite (opcional):
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

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
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Guardar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateActivityModal;
