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
  faXmark
} from '@fortawesome/free-solid-svg-icons';

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
  "#06B6D4", "#64748B"
];

const CreateCourseModal = ({ onClose, onSave, currentUserId }) => {
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    status: "active",
    icon: "book-open",
    durationHours: 0,
    color: COLOR_PALETTE[0],
    createdBy: currentUserId,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = 'auto';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      setError("El título y la descripción son obligatorios");
      return;
    }
    setError("");
    onSave(newCourse);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Encabezado */}
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

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título *
              </label>
              <input
                required
                value={newCourse.title}
                onChange={(e) => setNewCourse(p => ({ ...p, title: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={3}
                value={newCourse.description}
                onChange={(e) => setNewCourse(p => ({ ...p, description: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Estado y Duración */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <div className="relative">
                  <select
                    value={newCourse.status}
                    onChange={(e) => setNewCourse(p => ({ ...p, status: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="active">Activo</option>
                    <option value="draft">Borrador</option>
                    <option value="archived">Archivado</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duración (horas)
                </label>
                <input
                  type="number"
                  min={0}
                  value={newCourse.durationHours}
                  onChange={(e) => setNewCourse(p => ({ ...p, durationHours: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Iconos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewCourse(p => ({ ...p, icon: opt.value }))}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                      newCourse.icon === opt.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon 
                      icon={opt.icon} 
                      className={`text-xl ${
                        newCourse.icon === opt.value ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTE.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setNewCourse(p => ({ ...p, color }))}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      newCourse.color === color 
                        ? 'border-blue-500 scale-110 ring-2 ring-blue-200' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="pt-6 flex justify-end gap-3">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
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

export default CreateCourseModal;