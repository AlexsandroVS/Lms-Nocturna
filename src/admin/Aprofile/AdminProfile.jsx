// src/admin/Aprofile/AdminProfile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import DashboardSummary from "./DashboardSummary";
import SearchBar from "./SearchBar";
import UserTable from "./UserTable";
import EditUserModal from "../modals/EditUserModal";
import CreateUsersModal from "../modals/CreateUsersModal";
import DeleteUsersModal from "../modals/DeleteUsersModal";

// Importar el avatar por defecto
import defaultAvatar from "../../../public/img/admin-avatar.jpg";

// Definir SERVER_URL y la función getAvatarUrl
const SERVER_URL = "http://localhost:5000";
const getAvatarUrl = (avatar) => {
  if (!avatar) return defaultAvatar;
  return avatar.startsWith("http") ? avatar : `${SERVER_URL}${avatar}`;
};

const AdminProfile = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    // Puedes dejar el console.log para depuración
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      // Mapeo de los usuarios, asegurándonos de convertir isActive a un valor booleano
      const mappedUsers = response.data.map((u) => ({
        id: u.UserID,
        name: u.Name,
        email: u.Email,
        role: u.Role,
        avatar: u.Avatar ? getAvatarUrl(u.Avatar) : defaultAvatar,
        registrationDate: u.RegistrationDate,
        lastLogin: u.LastLogin,
        isActive: u.IsActive === 1,  // Convertimos el valor de 0 o 1 a un booleano (true/false)
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
      setError("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };
  

  // Filtrado de usuarios según la búsqueda (por nombre, email o rol)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditingUser(user);
  };
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
  };

  const handleModalClose = () => {
    setEditingUser(null);
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      await api.put(`/users/${updatedUser.id}`, updatedUser);
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };
  const handleUserDelete = async (userToDelete) => {
    try {
      await api.delete(`/users/${userToDelete.id}`);
      fetchUsers();
      setDeletingUser(null);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };
  const handleDeleteModalClose = () => {
    setDeletingUser(null);
  };

  const handleUserCreate = async (newUser) => {
    try {
      // Configurar headers para multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      await api.post("/users", newUser, config);
      fetchUsers();
      setCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <motion.div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <motion.div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-4xl font-bold">Gestor de Usuarios</h1>
        <p className="mt-2">
          Administra y supervisa todos los usuarios del sistema. Revisa métricas,
          filtra usuarios y realiza acciones de edición.
        </p>
      </motion.div>

      {/* Dashboard con métricas reales */}
      <DashboardSummary users={users} />

      {/* Barra de búsqueda y botón de creación */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 font-semibold text-white px-4 py-2 rounded-md transition-colors"
        >
          Crear Usuario
        </button>
        <SearchBar search={search} onSearch={setSearch} icon={faSearch} />
      </div>

      {/* Tabla de usuarios */}
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <UserTable users={filteredUsers} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleModalClose}
          onSave={handleUserUpdate}
        />
      )}

      {createModalOpen && (
        <CreateUsersModal
          onClose={() => setCreateModalOpen(false)}
          onSave={handleUserCreate}
        />
      )}
       {deletingUser && (
        <DeleteUsersModal
          user={deletingUser}
          onClose={handleDeleteModalClose}
          onConfirm={handleUserDelete}
        />
      )}
    </motion.div>
  );
};

export default AdminProfile;
