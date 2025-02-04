/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const CreateCourseModal = ({ onClose, onSave }) => {
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    status: "draft",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newCourse);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
        </button>

        <div className="space-y-6">
          <header>
            <h2 className="text-3xl font-bold text-gray-900">
              Crear Nuevo Curso
            </h2>
            <p className="text-gray-500 mt-1">Completa los campos requeridos</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del curso *
                </label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-32 resize-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado inicial
                </label>
                <select
                  value={newCourse.status}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[right_1rem_center] transition-all"
                >
                  <option value="draft">Borrador</option>
                  <option value="active">Activo</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-indigo-200"
              >
                Crear Curso
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
