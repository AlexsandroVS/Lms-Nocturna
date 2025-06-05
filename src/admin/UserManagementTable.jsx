/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faUserPlus,
  faUserShield,
  faUserGraduate,
  faUser,
  faCircleCheck,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

const UserManagementTable = ({
  users,
  onEdit,
  onDelete,
  currentUser,
  onCreate,
  isMobile,
}) => {
  const [expandedUser, setExpandedUser] = useState(null);

  const getRoleIcon = (role) => {
    if (!role) return faUser;
    switch (role.toLowerCase()) {
      case "admin":
        return faUserShield;
      case "teacher":
        return faUserGraduate;
      default:
        return faUser;
    }
  };

  const getRoleColor = (role) => {
    if (!role) return "bg-gray-100 text-gray-800";
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "teacher":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role) => {
    if (!role) return "Desconocido";
    switch (role.toLowerCase()) {
      case "admin":
        return "Admin";
      case "teacher":
        return "Docente";
      case "student":
        return "Estudiante";
      default:
        return "Desconocido";
    }
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm"
    >
      {/* Encabezado */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                Usuarios
              </span>
            </h2>
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
              {users.length} {users.length === 1 ? "usuario" : "usuarios"}
            </span>
          </div>
          {!isMobile && currentUser?.role !== "teacher" && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreate}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Nuevo Usuario</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Versión móvil */}
      {isMobile ? (
        <div className="divide-y divide-gray-100">
          <AnimatePresence>
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.src = "/img/default-avatar.png";
                            e.target.dataset.fallback = "true";
                          }
                        }}
                      />
                      {user.isActive && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 flex items-center gap-1">
                        {user.name}
                        {user.isActive && (
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-green-500 text-xs"
                          />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleUserExpansion(user.id)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </button>
                </div>

                <AnimatePresence>
                  {expandedUser === user.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={getRoleIcon(user.role)}
                            className={`text-sm ${
                              getRoleColor(user.role)
                                .replace("bg-", "text-")
                                .split(" ")[0]
                            }`}
                          />
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                              user.role
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Registro: {user.registrationDate}
                        </div>
                        {currentUser?.role !== "teacher" && (
                          <div className="flex gap-2 pt-2">
                            <motion.button
                              onClick={() => onEdit(user)}
                              whileTap={{ scale: 0.9 }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs"
                            >
                              <FontAwesomeIcon icon={faEdit} size="xs" />
                              <span>Editar</span>
                            </motion.button>
                            <motion.button
                              onClick={() => onDelete(user)}
                              whileTap={{ scale: 0.9 }}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                              <span>Eliminar</span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {users.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No hay usuarios registrados
            </div>
          )}

          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreate}
              className="fixed bottom-14 right-6 z-50 w-14 h-14 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <FontAwesomeIcon icon={faUserPlus} size="lg" />
            </motion.button>
          )}
        </div>
      ) : (
        /* Versión desktop */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 text-xs sm:text-sm font-medium">
                <th className="px-4 sm:px-6 py-3">Usuario</th>
                <th className="px-4 sm:px-6 py-3">Rol</th>
                <th className="px-4 sm:px-6 py-3">Registro</th>
                <th className="px-4 sm:px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow"
                            onError={(e) => {
                              if (!e.target.dataset.fallback) {
                                e.target.src = "/img/default-avatar.png";
                                e.target.dataset.fallback = "true";
                              }
                            }}
                          />
                          {user.isActive && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 flex items-center gap-1 text-sm sm:text-base">
                            {user.name}
                            {user.isActive && (
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="text-green-500 text-xs"
                              />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={getRoleIcon(user.role)}
                          className={`text-xs sm:text-sm ${
                            getRoleColor(user.role)
                              .replace("bg-", "text-")
                              .split(" ")[0]
                          }`}
                        />
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 py-3 text-xs sm:text-sm text-gray-600">
                      {user.registrationDate}
                    </td>

                    <td className="px-4 sm:px-6 py-3">
                      {currentUser?.role !== "teacher" && (
                        <div className="flex justify-end gap-2 sm:gap-3">
                          <motion.button
                            onClick={() => onEdit(user)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                            title="Editar usuario"
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-sm"
                            />
                          </motion.button>
                          <motion.button
                            onClick={() => onDelete(user)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1.5 sm:p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Eliminar usuario"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="text-sm"
                            />
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay usuarios registrados
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UserManagementTable;
