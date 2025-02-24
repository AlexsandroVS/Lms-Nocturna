/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faCircle,
  faCalendarAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

// Variantes para animar cada fila
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const StatusBadge = ({ active }) => (
  <div
    className={`inline-flex items-center px-3 py-1 rounded-full ${
      active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    <FontAwesomeIcon
      icon={faCircle}
      className={`h-2 w-2 mr-2 ${active ? "text-green-500" : "text-red-500"}`}
    />
    <span className="text-md font-medium">{active ? "Activo" : "Inactivo"}</span>
  </div>
);

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Versión Desktop */}
      <div className="hidden lg:block rounded-md">
        <motion.table
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className="bg-gradient-to-r from-red-500 to-red-600 sticky top-0 z-20">
            <tr>
              <th className="px-6 py-4 text-left text-md font-semibold text-white uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-left text-md font-semibold text-white uppercase tracking-wider">
                Detalles
              </th>
              <th className="px-6 py-4 text-left text-md font-semibold text-white uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-md font-semibold text-white uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-50">
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-red-50 group"
                whileHover={{ scale: 1.005 }}
              >
                {/* Columna de usuario */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <motion.div whileHover={{ scale: 1.1 }} className="relative">
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full border-2 border-red-200 group-hover:border-red-300"
                      />
                    </motion.div>
                    <div className="ml-4">
                      <p className="text-md font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-md font-medium text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Columna de detalles */}
                <td className="px-6 py-4">
                  <div className="grid gap-2">
                    <div className="flex items-center text-md">
                      <FontAwesomeIcon
                        icon={faUserShield}
                        className="w-4 h-4 mr-2 text-red-400"
                      />
                      <span className="font-medium text-gray-700">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center text-md">
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="w-4 h-4 mr-2 text-red-400"
                      />
                      <span className="text-gray-600">
                        {user.registrationDate
                          ? new Date(user.registrationDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Columna de estado */}
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start space-y-2">
                    <StatusBadge active={user.isActive} />
                    <span className="text-md text-gray-500">
                      Último login:{" "}
                      {user.isActive
                        ? "Activo"
                        : user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Sin inicio de sesión"}
                    </span>
                  </div>
                </td>

                {/* Acciones: Editar y Eliminar */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-start space-x-2">
                    <motion.button
                      onClick={() => onEdit(user)}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      <span className="text-sm font-medium">Editar</span>
                    </motion.button>
                    <motion.button
                      onClick={() => onDelete(user)}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-white text-red-600 border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                      <span className="text-sm font-medium">Eliminar</span>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>

      {/* Versión móvil con tarjetas */}
      <div className="lg:hidden space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-red-50 hover:border-red-100"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-red-200"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <StatusBadge active={user.isActive} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="w-4 h-4 mr-2 text-red-400"
                />
                <span>{user.role}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="w-4 h-4 mr-2 text-red-400"
                />
                <span>
                  {user.registrationDate
                    ? new Date(user.registrationDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <motion.button
                onClick={() => onEdit(user)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Editar
              </motion.button>
              <motion.button
                onClick={() => onDelete(user)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                Eliminar
              </motion.button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Último login:{" "}
              {user.isActive
                ? "Activo"
                : user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "Sin inicio de sesión"}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
