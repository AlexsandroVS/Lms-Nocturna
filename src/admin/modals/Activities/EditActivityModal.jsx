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
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

const EditActivityModal = ({ activity, onClose, onUpdate }) => {
  const { api, currentUser } = useAuth();
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document",
    deadline: "",
  });
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const { courseId, moduleId } = useParams();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(
          `/activities/${activity.ActivityID}/files`
        );
        setFiles(response.data); // Establecer archivos existentes
      } catch (error) {
        console.error("Error al obtener los archivos:", error);
      }
    };

    if (activity) {
      fetchFiles();

      setFormData({
        title: activity.Title || "",
        description: activity.Content || "",
        type: activity.Type || "document",
        deadline: activity.Deadline ? activity.Deadline.split("T")[0] : "",
      });
    }
  }, [activity, api]); // Se ejecuta al cambiar la actividad o la API

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedActivity = {
      ActivityID: activity.ActivityID,
      title: formData.title.trim() || undefined,
      content: formData.description.trim() || undefined,
      type: formData.type || undefined,
      deadline: formData.deadline || undefined,
    };
    
    try {
      const response = await api.put(
        `/activities/${updatedActivity.ActivityID}`,
        updatedActivity
      );
      window.location.reload(); // Forzar la recarga de la página
      if (response.data.message === "Actividad actualizada correctamente.") {
        onUpdate(updatedActivity); // Llama a onUpdate si la actualización es exitosa
        alert("Actividad actualizada correctamente.");
  
        // Cerrar el modal después de la actualización exitosa
        onClose();
       
      }
    } catch (error) {
      console.error("❌ Error al actualizar la actividad:", error.response?.data || error);
      alert("Hubo un error al actualizar la actividad.");
    }
  };
  
  const handleDeleteFile = async (fileId) => {
    try {
      // Eliminar el archivo del estado local inmediatamente
      const updatedFiles = files.filter((file) => file.FileID !== fileId);
      setFiles(updatedFiles);

      // Eliminar el archivo en el servidor
      await api.delete(`/files/${fileId}`);
      alert("Archivo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
      alert("Hubo un error al eliminar el archivo. Inténtalo de nuevo.");
    }
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleAddFile = async () => {
    if (!newFile) {
      alert("Por favor selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newFile);
    formData.append("courseId", courseId);

    try {
      const response = await api.post(
        `/courses/${courseId}/modules/${moduleId}/activities/${activity.ActivityID}/files`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Actualizar los archivos del estado con el nuevo archivo subido
      setFiles((prevFiles) => [...prevFiles, response.data]);

      // Limpiar el archivo seleccionado después de la subida
      setNewFile(null);

      alert("Archivo subido con éxito");

      // Llamar a la API nuevamente para obtener los archivos actualizados después de la subida
      const updatedFilesResponse = await api.get(
        `/activities/${activity.ActivityID}/files`
      );
      setFiles(updatedFilesResponse.data); // Establecer los archivos actualizados
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un error al subir el archivo. Inténtalo de nuevo.");
    }
  };

  // Obtener el ícono correspondiente al tipo de archivo
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return faFilePdf;
    } else if (
      fileType === "application/msword" ||
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return faFileWord;
    } else {
      return faFile;
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
          Editar Actividad
        </h2>

        {error && (
          <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
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
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

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
                <option value="document">Documento</option>
                <option value="task">Tarea</option>
                <option value="video">Video</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Fecha Límite */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Límite
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Archivos Asociados */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Archivos Administrativos
            </label>
            <div className="grid gap-4">
              {files.map((file) => (
                <div key={file.FileID} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${getFileColorClass(file.FileType)}`}>
                      <FontAwesomeIcon
                        icon={getFileIcon(file.FileType)}
                        className="text-white text-lg"
                      />
                    </div>
                    <span className="text-gray-700 truncate">{file.FileName}</span>
                  </div>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => handleDeleteFile(file.FileID)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subir Nuevo Archivo (Admin) */}
          {currentUser.role === "admin" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Agregar Archivo
              </label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept={getAcceptByType(formData.type)}
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3 text-gray-500">
                      <FontAwesomeIcon icon={faUpload} />
                      <span className="text-sm">Seleccionar archivo</span>
                    </div>
                  </div>
                </label>
                <button
                  onClick={handleAddFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Subir
                </button>
              </div>
            </div>
          )}
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
            Guardar Cambios
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Funciones auxiliares
const getFileColorClass = (fileType) => {
  if (fileType === "application/pdf") return "bg-red-500";
  if (fileType.includes("word")) return "bg-blue-500";
  if (fileType.startsWith("video/")) return "bg-purple-500";
  return "bg-gray-500";
};

const getAcceptByType = (type) => {
  switch(type) {
    case "document": return ".pdf,.doc,.docx";
    case "video": return "video/*";
    case "task": return ".pdf,.txt";
    default: return "";
  }

};

export default EditActivityModal;
