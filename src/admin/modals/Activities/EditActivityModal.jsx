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
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

const EditActivityModal = ({ activity, onClose, onUpdate }) => {
  const { api, currentUser } = useAuth();
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
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Editar Actividad
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Título:
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Descripción / Instrucciones:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Tipo de actividad:
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="document">Documento</option>
              <option value="task">Tarea</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Fecha límite:
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Archivos asociados (admin):
            </label>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.FileID}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 truncate">
                    {file.FileName}
                  </span>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => handleDeleteFile(file.FileID)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {currentUser.role === "admin" && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Agregar archivo:
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1 p-2 border rounded-lg"
                />
                <button
                  onClick={handleAddFile}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Subir
                </button>
              </div>
            </div>
          )}
        </div>

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
            Guardar Cambios
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditActivityModal;
