/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
import { useAuth } from "../../context/AuthContext";

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

const CoursesCard = ({ course, isAdmin = false, onEdit, onDelete, onRestrictedAccess }) => {
  const navigate = useNavigate();
  const { api, currentUser } = useAuth();
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  const [courseAverage, setCourseAverage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    title = "Curso sin título",
    description = "",
    icon = "book-open",
    status = "draft",
    durationHours = 0,
    createdByName = "Desconocido",
    color = "#4F46E5",
  } = course || {};

  const { color: statusColor, label: statusLabel } =
    STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const iconFa = ICON_MAP[icon] || faBookOpen;

  useEffect(() => {
    const fetchCourseAverage = async () => {
      const role = currentUser?.role;
      const userId = currentUser?.id;

      // No calcular promedio si es admin o teacher
      if (!userId || role === "admin" || role === "teacher") return;

      try {
        const response = await api.get(`/averages/${id}/${userId}`);
        const percentage = response.data?.courseAverage * 5;
        if (!isNaN(percentage)) {
          setCourseAverage(percentage);
        }
      } catch (error) {
        console.error("Error al obtener el promedio del curso:", error);
      }
    };

    fetchCourseAverage();
  }, [api, currentUser?.id, currentUser?.role, id]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser?.role === "student") {
        try {
          const res = await api.get(
            `/enrollments/student/${currentUser.id}/courses`
          );
          setEnrolledCourseIds(res.data.courseIds || []);
        } catch (err) {
          console.error("Error al obtener inscripciones:", err);
        }
      }
    };
    fetchEnrollments();
  }, [api, currentUser]);

const handleCardClick = () => {
  const role = currentUser?.role;
  const isEnrolled = enrolledCourseIds.includes(id);

  const canAccess = role === "admin" || role === "teacher" || isEnrolled;

  if (canAccess) {
    navigate(`/courses/${id}`);
  } else if (typeof onRestrictedAccess === "function") {
    onRestrictedAccess(course); 
  }
};

  const handleAdminClick = (e, callback) => {
    e.preventDefault();
    e.stopPropagation();
    callback?.(course);
  };

  return (
    <motion.div
      className="group bg-white rounded-xl shadow-sm  border-gray-100 p-6 h-[420px] flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating icon background */}
      <motion.div
        className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10"
        style={{ backgroundColor: color }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.15 : 0.1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 z-10">
        {/* Admin Actions */}
        {isAdmin && (
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={(e) => handleAdminClick(e, onEdit)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Editar curso"
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="text-gray-500 text-sm"
              />
            </button>
            <button
              onClick={(e) => handleAdminClick(e, onDelete)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Eliminar curso"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="text-red-500 text-sm"
              />
            </button>
          </motion.div>
        )}

        {/* Course Icon */}
        <div
          className="w-10 h-10 flex items-center justify-center rounded-lg backdrop-blur-sm shadow-sm"
          style={{
            backgroundColor: `${color}20`,
            border: `1px solid ${color}30`,
          }}
        >
          <FontAwesomeIcon
            icon={iconFa}
            className="text-lg"
            style={{ color }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        {/* Metadata */}
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {durationHours > 0 && (
              <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-[0.8em] opacity-70"
                />
                {durationHours}h
              </span>
            )}
            <span className={`${statusColor} px-2.5 py-1 rounded-full text-xs`}>
              {statusLabel}
            </span>
          </div>
          <span className="text-xs text-gray-400 block">
            Creado por: {createdByName}
          </span>
        </div>

        {/* Title & Description */}
        <div className="mb-4 space-y-3 flex-1 min-h-[120px] flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-snug">
            {title}
          </h3>
          <div className="flex-1 overflow-hidden">
            <p className="text-gray-500 text-sm line-clamp-4 leading-relaxed h-full">
              {description || "Descripción no disponible"}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          {courseAverage > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">
                  Progreso
                </span>
                <span className="text-xs font-semibold" style={{ color }}>
                  {Math.round(courseAverage)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(courseAverage)}%` }}
                  transition={{ duration: 0.8, type: "spring" }}
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <motion.button
            className="w-full py-2.5 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 text-sm transition-all"
            style={{ backgroundColor: color }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${id}`);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ver curso
            <motion.span
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CoursesCard;
