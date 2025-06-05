/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
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
  faSpinner,
  faPlus,
  faClock,
  faCalendarAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditActivityModal = ({
  activity,
  moduleId,
  courseId,
  onClose,
  onUpdate,
}) => {
  const { api } = useAuth();
  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document",
    deadline: "",
    MaxSubmissions: 1,
  });

  const [deadlineDate, setDeadlineDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(
          `/activities/${activity.ActivityID}/files`
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error al obtener archivos:", error);
      }
    };

    if (activity) {
      fetchFiles();
      setFormData({
        title: activity.Title || "",
        description: activity.Content || "",
        type: activity.Type || "document",
        MaxSubmissions: activity.MaxSubmissions || 1,
      });

      // Inicializar fecha
      if (activity.Deadline) {
        const date = new Date(activity.Deadline);
        setDeadlineDate(date);
        setFormData((prev) => ({
          ...prev,
          deadline: date.toISOString(),
        }));
      }
    }
  }, [activity, api]);

  // Ajustar posición del datepicker
  useEffect(() => {
    if (isDatePickerOpen) {
      const adjustPopperPosition = () => {
        const popper = document.querySelector(".react-datepicker-popper");
        if (popper) {
          popper.style.position = "absolute";
          popper.style.top = "0";
          popper.style.left = "0";
          popper.style.transform = "none";
          popper.style.zIndex = "9999";

          const inputRect = datePickerRef.current?.getBoundingClientRect();
          if (inputRect) {
            popper.style.top = `${inputRect.bottom + window.scrollY + 5}px`;
            popper.style.left = `${inputRect.left + window.scrollX}px`;
          }
        }
      };

      const timer = setTimeout(adjustPopperPosition, 50);
      return () => clearTimeout(timer);
    }
  }, [isDatePickerOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setDeadlineDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        deadline: date.toISOString(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        deadline: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      return setError("El título es obligatorio");
    }

    setLoadingSubmit(true);
    try {
      await api.put(`/activities/${activity.ActivityID}`, {
        title: formData.title.trim(),
        content: formData.description.trim(),
        deadline: formData.deadline || null,
        maxSubmissions: formData.MaxSubmissions || 1,
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error actualizando actividad:", error);
      setError("No se pudo actualizar la actividad.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles((prev) => prev.filter((file) => file.FileID !== fileId));
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      setError("Error al eliminar el archivo.");
    }
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };

  const handleAddFile = async () => {
    if (!newFiles.length) {
      setError("Selecciona al menos un archivo válido.");
      return;
    }

    const formDataUpload = new FormData();
    newFiles.forEach((file) => formDataUpload.append("files", file));

    setLoadingFile(true);
    try {
      await api.post(
        `/courses/${courseId}/modules/${moduleId}/activities/${activity.ActivityID}/files`,
        formDataUpload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedFiles = await api.get(
        `/activities/${activity.ActivityID}/files`
      );
      setFiles(updatedFiles.data);
      setNewFiles([]);
      setError("");
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      setError("Error al subir archivo. Revisa el formato o tamaño.");
    } finally {
      setLoadingFile(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") return faFilePdf;
    if (fileType.includes("word")) return faFileWord;
    return faFile;
  };

  const getFileColorClass = (fileType) => {
    if (fileType === "application/pdf") return "text-red-500";
    if (fileType.includes("word")) return "text-blue-500";
    return "text-gray-500";
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          Editar Actividad
        </h2>

        {error && (
          <div className="bg-red-50 p-4 rounded-xl text-sm text-red-600 mb-4 flex gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-sm">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border focus:outline-0 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Título de la actividad"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Descripción
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border focus:outline-0 border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Descripción detallada..."
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Intentos máximos
            </label>
            <input
              type="number"
              name="MaxSubmissions"
              min="1"
              value={formData.MaxSubmissions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  MaxSubmissions: parseInt(e.target.value, 10) || 1,
                }))
              }
              className="w-full p-3 border focus:outline-0 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Archivos actuales
            </label>
            <div className="space-y-2">
              {files.length > 0 ? (
                files.map((file) => (
                  <div
                    key={file.FileID}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FontAwesomeIcon
                        icon={getFileIcon(file.FileType)}
                        className={`text-lg ${getFileColorClass(
                          file.FileType
                        )}`}
                      />
                      <span className="truncate">{file.FileName}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file.FileID)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Eliminar archivo"
                    >
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">
                  No hay archivos adjuntos
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Agregar nuevos archivos
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex-1 p-3 border border-slate-300 rounded-xl cursor-pointer hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Seleccionar archivos</span>
                </div>
              </label>
              <button
                onClick={handleAddFile}
                disabled={loadingFile || newFiles.length === 0}
                className={`px-4 py-3 rounded-xl flex items-center gap-2 ${
                  loadingFile || newFiles.length === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {loadingFile ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faPlus} />
                )}
                <span>Agregar</span>
              </button>
            </div>
            {newFiles.length > 0 && (
              <div className="mt-2 text-sm text-slate-500">
                {newFiles.length} archivo(s) seleccionado(s)
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-sm">
            Fecha límite
          </label>
          <div className="relative" ref={datePickerRef}>
            <DatePicker
              selected={deadlineDate}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              minDate={new Date()}
              placeholderText="Seleccionar fecha y hora"
              className="w-full p-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              popperClassName="react-datepicker-popper-custom"
              popperPlacement="bottom-start"
              popperModifiers={[
                { name: "offset", options: { offset: [0, 5] } },
                {
                  name: "preventOverflow",
                  options: {
                    rootBoundary: "viewport",
                    tether: false,
                    altAxis: true,
                  },
                },
                {
                  name: "flip",
                  options: {
                    fallbackPlacements: ["top-start", "bottom-start"],
                    allowedAutoPlacements: ["bottom-start", "top-start"],
                  },
                },
              ]}
              customInput={
                <div className="flex items-center relative">
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="absolute left-3 text-slate-400"
                  />
                  <input
                    className="w-full p-2 pl-8 pr-8 bg-transparent focus:outline-none"
                    value={
                      deadlineDate
                        ? deadlineDate.toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""
                    }
                    readOnly
                  />
                  <FontAwesomeIcon
                    icon={faClock}
                    className="absolute right-3 text-slate-400"
                  />
                </div>
              }
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 transition-colors"
          >
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={loadingSubmit}
            whileHover={{ scale: loadingSubmit ? 1 : 1.05 }}
            whileTap={{ scale: loadingSubmit ? 1 : 0.98 }}
            className={`px-6 py-2 font-semibold text-white rounded-xl transition-colors ${
              loadingSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loadingSubmit ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Guardar Cambios
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditActivityModal;
