import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSave,
  faSpinner,
  faExclamationTriangle,
  faFile,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react/prop-types
const CreateActivityModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    deadline: "",
    maxSubmissions: 1,
    files: [],
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxSubmissions" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  // Reemplaza esto en CreateActivityModal.jsx
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return setError("El título y la descripción son obligatorios.");
    }
    if (files.length === 0) {
      return setError("Debes subir al menos un archivo.");
    }
    setLoading(true);
    setError("");
    try {
      const data = {
        ...formData,
        files,
      };
      const success = await onSave(data);
      if (success) onClose();
      else setError("Ocurrió un error al guardar la actividad.");
    } catch (err) {
      console.error("❌ Error al crear actividad:", err);
      setError("Error inesperado al crear la actividad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          Crear Nueva Actividad
        </h2>

        {error && (
          <div className="bg-red-50 p-4 rounded-xl text-sm text-red-600 mb-4 flex gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-sm">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl"
              placeholder="Ej: Introducción a Arduino"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Descripción
            </label>
            <textarea
              name="content"
              rows="3"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl resize-none"
              placeholder="Describe los objetivos y recursos..."
            />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center cursor-pointer"
          >
            <p className="text-sm text-slate-500 mb-2">
              Arrastra y suelta archivos aquí o usa el botón para seleccionar
            </p>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-slate-200 rounded-lg text-sm hover:bg-slate-300 transition"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar
              Archivos
            </button>
            {files.length > 0 && (
              <ul className="mt-3 text-sm text-slate-600 list-disc text-left">
                {files.map((file, i) => (
                  <li key={i}>
                    <FontAwesomeIcon icon={faFile} className="mr-2" />
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Intentos máximos
            </label>
            <input
              type="number"
              name="maxSubmissions"
              value={formData.maxSubmissions}
              min={1}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Fecha límite
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-xl"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            className="px-5 py-2 bg-slate-200 text-slate-800 rounded-xl"
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            className={`px-6 py-2 font-semibold text-white rounded-xl ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Creando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} /> Crear Actividad
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateActivityModal;
