/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

const CreateUsersModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Valor por defecto
    avatar: null, // Archivo para enviar si se selecciona
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const defaultAvatar = "/img/admin-avatar.pg";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Previsualización: convertir a base64 para mostrar mientras se sube
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      // Guardar el archivo en el estado para enviar
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor, complete los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      // Crear objeto FormData con todos los campos
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);

      // 📌 Establecer isActive en falso y lastLogin en null por defecto
      formDataToSend.append("isActive", false);
      formDataToSend.append("lastLogin", ""); // o null, dependiendo de tu backend

      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      // Llamar a onSave pasándole formDataToSend
      await onSave(formDataToSend);
    } catch (err) {
      console.error(err);
      setError(
        "Error al crear el usuario: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/20">
      <motion.div
        className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.8, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      >
        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Crear Usuario
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Formulario */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <motion.input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña *
            </label>
            <motion.input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <motion.select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="admin">Administrador</option>
              <option value="teacher">Profesor</option>
              <option value="student">Estudiante</option>
            </motion.select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Avatar
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16">
                <img
                  src={previewAvatar || defaultAvatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border"
                />
              </div>
              <motion.button
                onClick={() => fileInputRef.current.click()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Seleccionar
              </motion.button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex justify-end space-x-4">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? (
              "Creando..."
            ) : (
              <>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Crear
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateUsersModal;
