import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { users } from "../data/userData";
import { tableAnimations } from "../utils/animationUtils";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const UserManagementTable = () => {
  const [localUsers, setLocalUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);

  // Animaciones

  // Filtrar usuarios
  const filteredUsers = localUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Eliminar usuario
  const handleDelete = () => {
    setLocalUsers(localUsers.filter((user) => user.id !== userToDelete.id));
    setUserToDelete(null);
  };

  // Cambiar rol
  const handleRoleChange = (userId, newRole) => {
    setLocalUsers(
      localUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* Header con buscador mejorado */}
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

      {/* Tabla de usuarios mejorada */}
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
                  variants={tableAnimations}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
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
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                        user.role === "admin"
                          ? "border-indigo-100 bg-indigo-50 text-indigo-700"
                          : "border-gray-100 bg-gray-50 text-gray-700"
                      } hover:shadow-sm transition-all`}
                    >
                      <option value="admin">Administrador</option>
                      <option value="teacher">Instructor</option>
                      <option value="user">Estudiante</option>
                    </select>
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
                      <button
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => console.log("Editar usuario:", user.id)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => setUserToDelete(user)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-12"
        >
          <div className="mb-4 p-4 bg-gray-100 rounded-full">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 text-2xl"
            />
          </div>
          <h3 className="text-gray-600 font-medium">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Intenta con otros términos de búsqueda
          </p>
        </motion.div>
      )}

      {/* Modal mejorado */}
      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
        userName={userToDelete?.name}
      />
    </motion.div>
  );
};

export default UserManagementTable;
