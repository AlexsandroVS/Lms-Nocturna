/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBolt,
  faLaptopCode,
  faChalkboardTeacher,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  bolt: faBolt,
  "laptop-code": faLaptopCode,
  "chalkboard-teacher": faChalkboardTeacher,
  "graduation-cap": faGraduationCap,
};

const SERVER_URL = "http://localhost:5000";

export default function CourseCard({ course, onClick }) {
  const courseIcon = iconMap[course.icon] || faBook;
  const imageUrl = course.image?.startsWith("http")
    ? course.image
    : `${SERVER_URL}${course.image}`;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="w-[300px] bg-white rounded-lg shadow transition-transform duration-300 hover:shadow-lg flex-shrink-0"
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-3 flex flex-col justify-between space-y-0 h-[140px]">
        <div>
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[1.5rem]">
            {course.title}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 min-h-[1.5rem]">
            {course.description}
          </p>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span className="truncate">
              <FontAwesomeIcon
                icon={courseIcon}
                className="text-primary mr-1"
              />
              {course.category}
            </span>
            <span>{course.durationHours}h</span>
          </div>
          <div className="text-[10px] text-gray-400 truncate">
            Por {course.createdByName}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
