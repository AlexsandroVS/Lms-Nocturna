/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { 
  faBookOpen, 
  faBolt,
  faMicrochip,
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

const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },

  { value: "inactive", label: "Inactivo" },
];

const COLOR_PALETTE = [
  "#3B82F6", "#D00000", "#10B981", "#FFBA08",
  "#6366F1", "#EC4899", "#48CAE4", "#64748B",
  "#8B5CF6", "#F43F5E", "#8AC926", "#14B8A6"
];

export const EditCourseModal = ({ course, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
    icon: "book-open",
    durationHours: 0,
    color: COLOR_PALETTE[0],
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        status: course.status || "draft",
        icon: course.icon || "book-open",
        durationHours: course.durationHours || 0,
        color: course.color || COLOR_PALETTE[0],
      });
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...course, ...formData });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-10  z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-5 h-[95vh] w-full max-w-sm relative shadow-xl"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Editar curso</h2>
            <p className="text-sm text-gray-500 mt-1">Modifica los campos necesarios</p>
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
            {/* Título */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Título *
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Descripción */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duración (horas)
              </label>
              <input
                type="number"
                min={0}
                value={formData.durationHours}
                onChange={(e) => setFormData(p => ({ ...p, durationHours: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Iconos */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, icon: opt.value }))}
                    className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                      formData.icon === opt.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <FontAwesomeIcon 
                      icon={opt.icon} 
                      className={`text-lg ${
                        formData.icon === opt.value ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Colores */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PALETTE.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, color }))}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      formData.color === color 
                        ? 'border-blue-500 scale-110' 
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 ">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Guardar cambios
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};