/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSave,
  faExclamationTriangle,
  faFile,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";

const CreateActivityModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
    if (file) {
      // Validar el tipo de archivo
      const allowedTypes = [
        "application/pdf",  // PDF
        "application/msword",  // Word (.doc)
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word (.docx)
        "image/jpeg", // JPEG
        "image/png", // PNG
        "video/mp4", // MP4
        "video/avi", // AVI
        "video/mov", // MOV
        "video/webm", // WebM
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError("Tipo de archivo no permitido. Solo se permiten PDF y Word.");
        return;
      }

      // Validar el tamaño del archivo (50 MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("El archivo es demasiado grande. El límite es 50 MB.");
        return;
      }

      setError("");
      setFormData({ ...formData, file });
    }
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

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return faFilePdf;
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return faFileWord;
    } else {
      return faFile;
    }
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

          {/* Subir Archivo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Archivo (PDF o Word):
            </label>
            <div className="flex items-center gap-3">
              <label
                className="flex-1 flex flex-col items-center justify-center 
                border-2 border-dashed border-gray-300 rounded-lg p-6 
                hover:border-blue-500 transition-colors cursor-pointer"
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FontAwesomeIcon
                  icon={formData.file ? getFileIcon(formData.file.type) : faFile}
                  className={`text-xl mb-2 ${
                    formData.file
                      ? formData.file.type === "application/pdf"
                        ? "text-red-500"
                        : "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <p className="text-sm text-center">
                  {formData.file
                    ? formData.file.name
                    : "Haz click o arrastra tu archivo"}
                </p>
              </label>
            </div>
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