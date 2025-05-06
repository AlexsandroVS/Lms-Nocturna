/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
  faUserPlus,
  faUserShield,
  faUserGraduate,
  faUser,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";

const UserManagementTable = ({ users, onEdit, onDelete, onCreate }) => {
  // Función para determinar el icono según el rol
  const getRoleIcon = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return faUserShield;
      case 'teacher': return faUserGraduate;
      default: return faUser;
    }
  };

  // Función para determinar el color según el rol
  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Encabezado */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Usuarios Registrados
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
              </span>
            </h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Nuevo Usuario</span>
          </motion.button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600 text-sm font-medium">
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Registro</th>
              <th className="px-6 py-4 text-right">Acciones</th>
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                          onError={(e) => {
                            if (!e.target.dataset.fallback) {
                              e.target.src = '/img/default-avatar.png';
                              e.target.dataset.fallback = "true"; // evitar bucle
                            }
                          }}
                          
                        />
                        {user.isActive && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 flex items-center gap-1">
                          {user.name}
                          {user.isActive && (
                            <FontAwesomeIcon 
                              icon={faCircleCheck} 
                              className="text-green-500 text-xs" 
                              title="Usuario activo"
                            />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon 
                        icon={getRoleIcon(user.role)} 
                        className={`text-sm ${getRoleColor(user.role).replace('bg-', 'text-').split(' ')[0]}`}
                      />
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.registrationDate}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <motion.button
                        onClick={() => onEdit(user)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="Editar usuario"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </motion.button>
                      <motion.button
                        onClick={() => onDelete(user)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Eliminar usuario"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </motion.button>
                    </div>
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
    </motion.div>
  );
};

export default UserManagementTable;