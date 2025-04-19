/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const ICON_MAP = {
  "book-open": faBookOpen,
  bolt: faBolt,
  microchip: faMicrochip,
  toolbox: faToolbox,
  robot: faRobot,
  "chalkboard-teacher": faChalkboardTeacher,
  "laptop-code": faLaptopCode,
  "graduation-cap": faGraduationCap,
};

export default function UserCourseCard({ course, average }) {
  const navigate = useNavigate();
  const progress = course.progress || 0;
  const color = course.color || "#EC4899";
  const courseIcon = ICON_MAP[course.icon] || faBookOpen;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      {course.image && (
        <img
          src={`http://localhost:5000${course.image}`}
          alt={course.title}
          className="w-full h-36 object-cover object-center"
        />
      )}

      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="flex flex-col gap-1">
          {/* Título y descripción con altura fija */}
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3.5rem]">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 min-h-[3rem]">
            {course.description}
          </p>

          <div className="flex justify-between items-center text-sm mt-2">
            <span className="font-medium flex items-center gap-1" style={{ color }}>
              <FontAwesomeIcon icon={courseIcon} />
              {course.durationHours}h
            </span>
            <span className="text-gray-400 text-xs truncate">
              Por {course.createdByName}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
          <div className="text-sm mt-1 text-right" style={{ color }}>
            <FontAwesomeIcon icon={faChartLine} className="mr-1" />
            <span className="font-semibold">
              Promedio: {typeof average === "number" ? `${average.toFixed(0)}%` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
