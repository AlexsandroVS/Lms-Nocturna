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
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

const CreateActivityModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "",
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
      let allowedTypes = [];
      let errorMessage = "";
      
      switch(formData.type) {
        case "Documento":
          allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ];
          errorMessage = "Solo se permiten documentos PDF y Word";
          break;
        case "Video":
          allowedTypes = ["video/mp4", "video/avi", "video/mov", "video/webm"];
          errorMessage = "Solo se permiten archivos de video (MP4, AVI, MOV, WebM)";
          break;
        case "Tarea":
          allowedTypes = ["application/pdf", "text/plain"];
          errorMessage = "Solo se permiten PDF o archivos de texto";
          break;
        default:
          allowedTypes = [];
          errorMessage = "Selecciona un tipo de actividad primero";
      }

      if (!allowedTypes.includes(file.type)) {
        setError(errorMessage);
        return;
      }

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
    if (!formData.type) {
      setError("Debes seleccionar un tipo de actividad.");
      return;
    }
    if (!formData.file) {
      setError("El archivo es obligatorio.");
      return;
    }
    setError("");
    onSave(formData);
  };

  const getFileIcon = () => {
    switch(formData.type) {
      case "Documento":
        return formData.file?.type === "application/pdf" ? faFilePdf : faFileWord;
      case "Video":
        return faVideo;
      case "Tarea":
        return faFile;
      default:
        return faFile;
    }
  };

  const getUploadLabel = () => {
    switch(formData.type) {
      case "Documento":
        return "Subir documento (PDF o Word)";
      case "Video":
        return "Subir video (MP4, AVI, MOV, WebM)";
      case "Tarea":
        return "Subir archivo de la tarea (PDF o TXT)";
      default:
        return "Selecciona un tipo de actividad primero";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Crear Nueva Actividad
        </h2>

        {error && (
          <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Tipo de Actividad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Actividad
            </label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="">Seleccionar tipo...</option>
                <option value="Tarea">Tarea</option>
                <option value="Video">Video</option>
                <option value="Documento">Documento</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Introducción a React"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="3"
              placeholder="Describe los objetivos y requisitos de la actividad..."
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Subir Archivo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {getUploadLabel()}
            </label>
            <label className="group relative cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept={
                  formData.type === "Documento" ? ".pdf,.doc,.docx" :
                  formData.type === "Video" ? "video/*" :
                  formData.type === "Tarea" ? ".pdf,.txt" : ""
                }
                disabled={!formData.type}
              />
              <div className={`border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all 
                ${formData.file ? "border-blue-500 bg-blue-50" : "group-hover:border-blue-300"}`}>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={getFileIcon()}
                      className={`text-xl ${
                        formData.file ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500">
                    {formData.file ? (
                      <span className="text-blue-600 font-medium">{formData.file.name}</span>
                    ) : (
                      "Haz click o arrastra tu archivo"
                    )}
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Fecha Límite */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Límite (Opcional)
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mt-8 flex justify-end gap-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSave} />
            Crear Actividad
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateActivityModal;