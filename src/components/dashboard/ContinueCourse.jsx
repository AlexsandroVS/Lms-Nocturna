import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import {
  faArrowRight,
  faBolt,
  faRobot,
  faMicrochip,
  faTools,
} from "@fortawesome/free-solid-svg-icons";

export default function ContinueCourse() {
  // Mapeo de cursos con sus iconos
  const courses = [
    {
      name: "Energías Renovables",
      lesson: "Lección 5",
      icon: faBolt,
      color: "#48CAE4",
    },
    {
      name: "Robótica Básica",
      lesson: "Lección 3",
      icon: faRobot,
      color: "#8AC926",
    },
    {
      name: "Programación de PLC",
      lesson: "Lección 8",
      icon: faMicrochip,
      color: "#FFBA08",
    },
    {
      name: "Mantenimiento Industrial",
      lesson: "Lección 2",
      icon: faTools,
      color: "#d00000",
    },
  ];

  // Curso actual (puedes cambiar el índice para mostrar diferentes cursos)
  const currentCourse = courses[0];

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl"
    >
      <div className="flex flex-wrap justify-between mb-4">
        <h2 className="font-semibold text-xl text-[#003049]">
          Continúa donde lo dejaste
        </h2>
        <span className="text-md font-semibold" style={{ color: currentCourse.color }}>
          {currentCourse.name} - {currentCourse.lesson}
        </span>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div
          className="w-24 h-24 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${currentCourse.color}20` }}
        >
          <FontAwesomeIcon
            icon={currentCourse.icon}
            className="text-4xl"
            style={{ color: currentCourse.color }}
          />
        </div>
        <div className="flex-1 w-full">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: "75%",
                backgroundColor: currentCourse.color,
              }}
            />
          </div>
          <button
            className="mt-4 text-lg font-bold text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: currentCourse.color }}
          >
            Continuar Lección{" "}
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
