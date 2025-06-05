/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSave,
  faClock,
  faSpinner,
  faExclamationTriangle,
  faFile,
  faPlus,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateActivityModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    deadline: "",
    maxSubmissions: 1,
    files: [],
  });
  const [deadlineDate, setDeadlineDate] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const fileInputRef = useRef(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);
  // Sincronizar el datepicker con el estado
  useEffect(() => {
    if (formData.deadline) {
      setDeadlineDate(new Date(formData.deadline));
    } else {
      setDeadlineDate(null);
    }
  }, [formData.deadline]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxSubmissions" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleDateChange = (date) => {
    setDeadlineDate(date);
    if (date) {
      setFormData((prev) => ({
        ...prev,
        deadline: date.toISOString(),
      }));
      setDateError("");
    } else {
      setFormData((prev) => ({
        ...prev,
        deadline: "",
      }));
    }
  };

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

          // Ajuste adicional para asegurar la posición correcta
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

  const handleFileChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.title.trim() || !formData.content.trim()) {
      return setError("El título y la descripción son obligatorios.");
    }

    if (files.length === 0) {
      return setError("Debes subir al menos un archivo.");
    }

    if (!deadlineDate) {
      return setDateError("Debes establecer una fecha límite");
    }

    if (deadlineDate < new Date()) {
      return setDateError("La fecha no puede ser en el pasado");
    }

    setLoading(true);
    setError("");
    try {
      const data = {
        ...formData,
        files,
      };
      const success = await onSave(data);
      if (success) onClose();
      else setError("Ocurrió un error al guardar la actividad.");
    } catch (err) {
      console.error("Error al crear actividad:", err);
      setError("Error inesperado al crear la actividad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 scrollbar-hidden flex items-center justify-center z-50 backdrop-blur-sm bg-black/40">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-2xl scrollbar-hidden w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
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
          Crear Nueva Actividad
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
              placeholder="Ej: Introducción a Arduino"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              rows="3"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 border focus:outline-0 border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe los objetivos y recursos..."
              required
            />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center cursor-pointer hover:border-purple-400 transition-colors"
          >
            <p className="text-sm text-slate-500 mb-2">
              Arrastra y suelta archivos aquí o usa el botón para seleccionar
            </p>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-slate-200 rounded-lg text-sm hover:bg-slate-300 transition"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar
              Archivos
            </button>
            {files.length > 0 && (
              <ul className="mt-3 text-sm text-slate-600 list-disc list-inside">
                {files.map((file, i) => (
                  <li key={i} className="truncate">
                    <FontAwesomeIcon
                      icon={faFile}
                      className="mr-2 text-purple-500"
                    />
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Intentos máximos
            </label>
            <input
              type="number"
              name="maxSubmissions"
              value={formData.maxSubmissions}
              min={1}
              onChange={handleChange}
              className="w-full p-3 border focus:outline-0 border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm">
              Fecha límite <span className="text-red-500">*</span>
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
                  {
                    name: "offset",
                    options: {
                      offset: [0, 5], // Ajuste fino de la posición vertical
                    },
                  },
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
                renderCustomHeader={({
                  monthDate,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex items-center justify-between px-2 py-1 bg-white border-b border-slate-200">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
                    >
                      &larr;
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                      {monthDate.toLocaleString("es-ES", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-50"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              />
            </div>
            {dateError && (
              <p className="mt-1 text-sm text-red-600">{dateError}</p>
            )}
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
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`px-6 py-2 font-semibold text-white rounded-xl transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Creando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Crear Actividad
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateActivityModal;
