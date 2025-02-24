import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faChalkboardTeacher,
  faLaptopCode,
  faGraduationCap,
  faClock,
  faArrowRight,
  faEdit,
  faTrash,
  faRobot,
  faMicrochip,
  faTools,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";

const ICON_MAP = {
  "book-open": faBookOpen,
  "chalkboard-teacher": faChalkboardTeacher,
  "laptop-code": faLaptopCode,
  "graduation-cap": faGraduationCap,
  bolt: faBolt,
  robot: faRobot,
  microchip: faMicrochip,
  tools: faTools,
};

const STATUS_CONFIG = {
  active: { color: "bg-green-100 text-green-700", label: "Activo" },
  archived: { color: "bg-gray-100 text-gray-700", label: "Archivado" },
  inactive: { color: "bg-amber-100 text-amber-700", label: "Inactivo" },
  draft: { color: "bg-blue-100 text-blue-700", label: "Borrador" },
};

const CoursesCard = ({ course, isAdmin = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const {
    id,
    title = "Curso sin título",
    description = "",
    icon = "book-open",
    status = "draft",
    durationHours = 0,
    createdByName = "Desconocido",
    color = "#4F46E5",
    progress = 0,
  } = course || {};

  const { color: statusColor, label: statusLabel } =
    STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const iconFa = ICON_MAP[icon] || faBookOpen;

  const handleCardClick = () => navigate(`/courses/${id}`);

  const handleAdminClick = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.(course);
  };

  return (
    <motion.div
      className="group bg-white shadow-md rounded-xl p-4 hover:shadow-lg h-[350px] flex flex-col justify-between relative overflow-hidden cursor-pointer border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleCardClick}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2 z-10">
            <button
              onClick={(e) => handleAdminClick(e, onEdit)}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Editar curso"
            >
              <FontAwesomeIcon icon={faEdit} className="text-gray-500 text-sm" />
            </button>
            <button
              onClick={(e) => handleAdminClick(e, onDelete)}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Eliminar curso"
            >
              <FontAwesomeIcon icon={faTrash} className="text-red-500 text-sm" />
            </button>
          </div>
        )}

        {/* Course Icon */}
        <div
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-opacity-20 backdrop-blur-sm"
          style={{ backgroundColor: `${color}30` }}
        >
          <FontAwesomeIcon icon={iconFa} className="text-lg" style={{ color }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Metadata */}
        <div className="mb-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {durationHours > 0 && (
              <span className="flex items-center gap-1 text-gray-600">
                <FontAwesomeIcon icon={faClock} className="text-[0.8em]" />
                {durationHours}h
              </span>
            )}
            <span className={`${statusColor} px-2 py-1 rounded-full`}>
              {statusLabel}
            </span>
          </div>
          <span className="text-xs text-gray-500 block">Creado por: {createdByName}</span>
        </div>

        {/* Title & Description */}
        <div className="mb-4 space-y-2 flex-1 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {description || "Descripción no disponible"}
          </p>
        </div>

        {/* Progress Section */}
        <div className="border-t pt-4 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 font-medium">
              <span>Progreso</span>
              <span>{progress}%</span>
            </div>
            <motion.div
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: color }}
              />
            </motion.div>
          </div>

          {/* Action Button */}
          <button
            className="w-full py-2 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: color }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${id}`);
            }}
          >
            Ver curso
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CoursesCard;