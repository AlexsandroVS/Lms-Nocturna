import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave } from "@fortawesome/free-solid-svg-icons";

const EditActivityModal = ({ activity, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "pdf",
    deadline: "",
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.Title || "",
        description: activity.Content ? activity.Content.url || "" : "", // ✅ Se obtiene correctamente el contenido
        type: activity.Type || "pdf",
        deadline: activity.Deadline ? activity.Deadline.split("T")[0] : "",
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const updatedActivity = {
      ...activity,
      Title: formData.title,
      Content: formData.description.trim() || null, // ✅ Guardar como texto sin formato JSON
      Type: formData.type,
      Deadline: formData.deadline || null,
    };
  
    console.log("📌 Datos enviados para actualizar:", updatedActivity);
    onUpdate(updatedActivity);
  };
  
  
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg relative"
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
              <option value="pdf">PDF</option>
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
