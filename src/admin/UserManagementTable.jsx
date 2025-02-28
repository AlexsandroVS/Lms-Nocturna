/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import DefaultAvatar from "../../public/img/admin-avatar.jpg"; // Asegúrate de importar el avatar por defecto

// Función para construir la URL del avatar


const UserManagementTable = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar usuarios según búsqueda
  const filteredUsers = users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white flex flex-col h-[600px] rounded-xl shadow-2xl p-6"
    >
      {/* Header con buscador */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Gestión de Usuarios
          </h2>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            {filteredUsers.length} usuarios
          </span>
        </div>
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3.5 text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 font-semibold">Rol</th>
              <th className="px-4 py-3 font-semibold">Registro</th>
              <th className="px-4 py-3 font-semibold text-right">Acciones</th>
            </tr>
          </thead>

          <AnimatePresence>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}// Aquí usamos la función getAvatarUrl
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-gray-500 text-sm font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{user.role}</span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">
                        {new Date(user.registrationDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(user.registrationDate).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <motion.button
                        onClick={() => onEdit(user)} // Llamamos a onEdit
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Editar
                      </motion.button>
                      <motion.button
                        onClick={() => onDelete(user)} // Llamamos a onDelete
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                        Eliminar
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </motion.div>
  );
};

export default UserManagementTable;
