/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faClock,
  faArrowRight,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  countActivities,
  calculateModuleDuration,
} from "../../utils/courseUtils";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ModuleList = ({
  modules,
  color,
  onEditModule = () => {},
  onDeleteModule = () => {},
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        console.log("Módulo:", module); // Verifica que cada módulo tenga los datos esperados
        const totalActivities = countActivities(module);
        const totalMinutes = calculateModuleDuration(module);

        return (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 group"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="mr-2 transition-colors"
                      style={{ color }}
                    />
                    {totalActivities} actividades
                  </motion.span>
                  <motion.span
                    className="flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <FontAwesomeIcon
                      icon={faClock}
                      className="mr-2 transition-colors"
                      style={{ color }}
                    />
                    {totalMinutes} minutos
                  </motion.span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Botón Ir al módulo */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-full text-white font-medium flex items-center gap-2"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    console.log(module); // Verifica el valor de los parámetros
                    if (module.CourseID && module.ModuleID) {
                      // Asegúrate de que `ModuleID` es `ModuleID` y `CourseID` es `CourseID`
                      navigate(
                        `/courses/${module.CourseID}/modules/${module.ModuleID}`
                      ); // Usa `ModuleID` para la redirección
                    } else {
                      console.error(
                        "Error: No se puede redirigir debido a CourseID o ModuleID inválido.",
                        module
                      );
                    }
                  }}
                >
                  Ir al módulo
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </motion.button>

                {/* Botones de edición y eliminación (Solo para Admins) */}
                {currentUser?.role === "admin" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditModule(module); // Pasa todo el módulo para editar
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteModule(module.ModuleID); // Asegúrate de pasar `ModuleID` correctamente
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ModuleList;
