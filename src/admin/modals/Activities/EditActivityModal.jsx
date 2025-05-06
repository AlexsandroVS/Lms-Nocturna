/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSave,
  faFile,
  faFilePdf,
  faFileWord,
  faUpload,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

const EditActivityModal = ({ activity, onClose, onUpdate }) => {
  const { api, currentUser } = useAuth();
  const { courseId } = useParams();

  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document",
    deadline: "",
    maxAttempts: 1,
  });

  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(
          `/activities/${activity.ActivityID}/files`
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error al obtener archivos:", error);
      }
    };

    if (activity) {
      fetchFiles();
      setFormData({
        title: activity.Title || "",
        description: activity.Content || "",
        type: activity.Type || "document",
        deadline: activity.Deadline ? activity.Deadline.split("T")[0] : "",
        maxAttempts: activity.MaxAttempts || 1,
      });
    }
  }, [activity, api]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // En EditActivityModal
  const handleSubmit = async () => {
    setLoadingSubmit(true);
    try {
      await api.put(`/activities/${activity.ActivityID}`, {
        title: formData.title.trim(),
        content: formData.description.trim(),
        type: formData.type,
        deadline: formData.deadline || null,
        maxAttempts: formData.maxAttempts || 1,
      });

      onUpdate(); // ← solo notifica que se actualizó
      onClose();
    } catch (error) {
      console.error("Error actualizando actividad:", error);
      setError("No se pudo actualizar la actividad.");
    } finally {
      setLoadingSubmit(false);
    }
  };  

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((file) => file.FileID !== fileId));
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      alert("Error al eliminar el archivo.");
    }
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleAddFile = async () => {
    if (!newFile) {
      setError("Selecciona un archivo válido.");
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", newFile);
    formDataUpload.append("courseId", courseId);

    setLoadingFile(true);
    try {
      await api.post(
        `/activities/${activity.ActivityID}/files`,
        formDataUpload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updatedFiles = await api.get(
        `/activities/${activity.ActivityID}/files`
      );
      setFiles(updatedFiles.data);
      setNewFile(null);
      setError("");
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setError("Error al subir archivo.");
    } finally {
      setLoadingFile(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") return faFilePdf;
    if (fileType.includes("word")) return faFileWord;
    return faFile;
  };

  const getFileColorClass = (fileType) => {
    if (fileType === "application/pdf") return "bg-red-500";
    if (fileType.includes("word")) return "bg-blue-500";
    if (fileType.startsWith("video/")) return "bg-purple-500";
    return "bg-gray-500";
  };

  const getAcceptByType = (type) => {
    switch (type) {
      case "document":
      case "task":
        return ".pdf,.doc,.docx,.pptx";
      case "video":
        return "video/*";
      default:
        return "*";
    }
  };

  return (
    <div className="fixed scrollbar- inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl relative max-h-[90vh] scrollbar-hidden overflow-y-auto"
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
          Editar Actividad
        </h2>

        {error && (
          <div className="bg-red-100 p-4 mb-4 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Inputs de formulario */}
          <Input
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <Textarea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Select
            label="Tipo de Actividad"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
          <Input
            label="Fecha Límite"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            type="date"
          />

          {/* Archivos actuales */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Archivos de la Actividad
            </label>
            <div className="grid gap-4">
              {files.map((file) => (
                <div
                  key={file.FileID}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg ${getFileColorClass(
                        file.FileType
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={getFileIcon(file.FileType)}
                        className="text-white text-lg"
                      />
                    </div>
                    <span className="text-gray-700 truncate">
                      {file.FileName}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(file.FileID)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Input
            label="Intentos máximos de entrega"
            name="maxAttempts"
            type="number"
            min="1"
            value={formData.maxAttempts}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxAttempts: parseInt(e.target.value, 10) || 1,
              }))
            }
          />

          {/* Subir nuevo archivo */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Agregar nuevo archivo
            </label>
            <div className="flex gap-3">
              <input
                type="file"
                accept={getAcceptByType(formData.type)}
                onChange={handleFileChange}
                className="border border-gray-300 rounded-xl p-2 w-full"
              />
              <button
                onClick={handleAddFile}
                disabled={loadingFile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                {loadingFile ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} />
                    Subir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
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
            disabled={loadingSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {loadingSubmit ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Guardando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                Guardar
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Subcomponentes reutilizables
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
    >
      <option value="document">Documento</option>
      <option value="task">Tarea</option>
      <option value="video">Video</option>
    </select>
  </div>
);

export default EditActivityModal;
