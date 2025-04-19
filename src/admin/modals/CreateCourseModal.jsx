/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBolt,
  faMicrochip,
  faExclamationTriangle,
  faToolbox,
  faRobot,
  faChalkboardTeacher,
  faLaptopCode,
  faGraduationCap,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ICON_OPTIONS = [
  { value: "book-open", icon: faBookOpen },
  { value: "chalkboard-teacher", icon: faChalkboardTeacher },
  { value: "laptop-code", icon: faLaptopCode },
  { value: "graduation-cap", icon: faGraduationCap },
  { value: "bolt", icon: faBolt },
  { value: "robot", icon: faRobot },
  { value: "microchip", icon: faMicrochip },
  { value: "toolbox", icon: faToolbox },
];

const COLOR_PALETTE = [
  "#60A5FA", "#3B82F6", "#6366F1", "#8B5CF6",
  "#EC4899", "#F43F5E", "#F59E0B", "#10B981",
  "#06B6D4", "#64748B",
];

const CATEGORY_OPTIONS = [
  "Programación", "Desarrollo Web", "Blockchain",
  "Marketing Digital", "Diseño Gráfico", "Educación",
  "Mecatrónica", "Robótica",
];

const inputClass =
  "w-full p-3 rounded-xl bg-white border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

export const CreateCourseModal = ({ onClose, onSave, currentUserId }) => {
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    status: "active",
    icon: "book-open",
    durationHours: 0,
    color: COLOR_PALETTE[0],
    createdBy: currentUserId,
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      setError("El título y la descripción son obligatorios");
      return;
    }
    setError("");

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ ...newCourse }));
      if (imageFile) formData.append("image", imageFile);
      onSave(formData);
    } catch (err) {
      console.error("Error al preparar los datos:", err);
      setError("Error al preparar los datos del curso");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white rounded-2xl scrollbar-hidden shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nuevo Curso</h2>
              <p className="text-sm text-gray-500 mt-1">Completa los campos requeridos</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Título *</label>
              <input
                required
                value={newCourse.title}
                onChange={(e) => setNewCourse((p) => ({ ...p, title: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción *</label>
              <textarea
                required
                rows={3}
                value={newCourse.description}
                onChange={(e) => setNewCourse((p) => ({ ...p, description: e.target.value }))}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={newCourse.status}
                  onChange={(e) => setNewCourse((p) => ({ ...p, status: e.target.value }))}
                  className={inputClass}
                >
                  <option value="active">Activo</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duración (horas)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newCourse.durationHours}
                  onChange={(e) =>
                    setNewCourse((p) => ({ ...p, durationHours: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Icono</label>
              <div className="grid grid-cols-4 gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewCourse((p) => ({ ...p, icon: opt.value }))}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                      newCourse.icon === opt.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon
                      icon={opt.icon}
                      className={`text-xl ${
                        newCourse.icon === opt.value ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTE.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setNewCourse((p) => ({ ...p, color }))}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      newCourse.color === color
                        ? "border-blue-500 scale-110 ring-2 ring-blue-200"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select
                value={newCourse.category}
                onChange={(e) => setNewCourse((p) => ({ ...p, category: e.target.value }))}
                className={inputClass}
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagen del curso
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full file:px-4 file:py-2 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
              />
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Crear Curso
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};


