/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faBookOpen,
  faBolt,
  faMicrochip,
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

const STATUS_OPTIONS = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
];

const COLOR_PALETTE = [
  "#60A5FA",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#64748B",
];
const CATEGORY_OPTIONS = [
  "Programación", "Desarrollo Web", "Blockchain",
  "Marketing Digital", "Diseño Gráfico", "Educación",
  "Mecatrónica", "Robótica",
];

const inputClass =
  "w-full p-3 rounded-xl bg-white border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

export const EditCourseModal = ({ course, onClose, onSave }) => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    status: "active",
    icon: "book-open",
    color: COLOR_PALETTE[0],
    category: "",
    image: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setCourseData({
        title: course.title || "",
        description: course.description || "",
        status: course.status || "draft",
        icon: course.icon || "book-open",
        color: course.color || COLOR_PALETTE[0],
        category: course.category || "",
        image: course.image || null,
      });
    }
  }, [course]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formPayload = new FormData();
      const updatedFields = {};

      Object.keys(courseData).forEach((key) => {
        if (key !== "image" && courseData[key] !== course[key]) {
          updatedFields[key] = courseData[key];
        }
      });

      if (Object.keys(updatedFields).length === 0 && !imageFile) {
        setError("No se realizaron cambios");
        return;
      }

      formPayload.append("id", course.id);

      Object.entries(updatedFields).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      if (imageFile) {
        formPayload.append("image", imageFile);
      }

      await onSave(formPayload);
      onClose();
    } catch (err) {
      console.error("Error al editar curso:", err);
      setError("Error al guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white scrollbar-hidden rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Editar Curso</h2>
              <p className="text-sm text-gray-500 mt-1">
                Modifica los campos necesarios
              </p>
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
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-500"
              />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título *
              </label>
              <input
                required
                value={courseData.title}
                onChange={(e) =>
                  setCourseData((p) => ({ ...p, title: e.target.value }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={3}
                value={courseData.description}
                onChange={(e) =>
                  setCourseData((p) => ({ ...p, description: e.target.value }))
                }
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={courseData.status}
                  onChange={(e) =>
                    setCourseData((p) => ({ ...p, status: e.target.value }))
                  }
                  className={inputClass}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-3">
                {ICON_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setCourseData((p) => ({ ...p, icon: opt.value }))
                    }
                    className={`p-3 rounded-xl border-2 flex items-center justify-center transition-all ${
                      courseData.icon === opt.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent hover:border-blue-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon
                      icon={opt.icon}
                      className={`text-xl ${
                        courseData.icon === opt.value
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PALETTE.map((color) => (
                  <motion.button
                    key={color}
                    type="button"
                    onClick={() => setCourseData((p) => ({ ...p, color }))}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      courseData.color === color
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={courseData.category}
                onChange={(e) => setCourseData((p) => ({ ...p, category: e.target.value }))}
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
              {courseData.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Imagen actual:</p>
                  <img
                    src={`http://localhost:5000${courseData.image}`}
                    alt="Preview"
                    className="h-44 w-full object-cover rounded-lg"
                  />
                </div>
              )}
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
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
