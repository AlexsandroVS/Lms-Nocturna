/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen,faChalkboardTeacher, faLaptopCode, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const ICON_OPTIONS = [
  { value: "book-open", icon: faBookOpen },
  { value: "chalkboard-teacher", icon: faChalkboardTeacher },
  { value: "laptop-code", icon: faLaptopCode },
  { value: "graduation-cap", icon: faGraduationCap },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newCourse);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-4 w-full max-w-lg relative shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nuevo Curso</h2>
            <p className="text-sm text-gray-500 mt-1">Completa los campos requeridos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Título y Descripción */}
            <div className="space-y-4 sm:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Título *
                </label>
                <input
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Estado y Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Estado
              </label>
              <select
                value={newCourse.status}
                onChange={(e) => setNewCourse(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Activo</option>
                <option value="draft">Borrador</option>
                <option value="archived">Archivado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duración (horas)
              </label>
              <input
                type="number"
                min={0}
                value={newCourse.durationHours}
                onChange={(e) => setNewCourse(p => ({ ...p, durationHours: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Iconos */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setNewCourse(p => ({ ...p, icon: opt.value }))}
                    className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                      newCourse.icon === opt.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={opt.icon} 
                      className={`text-lg ${
                        newCourse.icon === opt.value ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCourse(p => ({ ...p, color }))}
                    className={`h-8 w-8 rounded-full border-2 transition-transform ${
                      newCourse.color === color 
                        ? 'border-blue-500 scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Crear Curso
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateCourseModal;