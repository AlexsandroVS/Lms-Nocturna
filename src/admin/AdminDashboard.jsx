import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AdminStats from "./AdminStats";
import UserManagementTable from "./UserManagementTable";
import CourseManagement from "./CourseManagement";
import EditUserModal from "./modals/EditUserModal"; // Importar el modal de edición
import DeleteUsersModal from "./modals/DeleteUsersModal"; // Importar el modal de eliminación
import { useAuth } from "../context/AuthContext";

// Función para obtener la URL del avatar
const getAvatarUrl = (avatar) => {
  const SERVER_URL = "http://localhost:5000";
  if (!avatar) return "/img/admin-avatar.jpg";  // Ruta de la imagen por defecto en public/img/
  return avatar.startsWith("http") ? avatar : `${SERVER_URL}${avatar}`; // Si es relativo, construir la URL completa
};

export default function AdminDashboard() {
  const [editingUser, setEditingUser] = useState(null); // Estado para el usuario que se va a editar
  const [deletingUser, setDeletingUser] = useState(null); // Estado para el usuario que se va a eliminar
  const { api } = useAuth();
  const [users, setUsers] = useState([]); // Almacenamos los usuarios obtenidos de la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      const mappedUsers = response.data.map((u) => ({
        id: u.UserID,
        name: u.Name,
        email: u.Email,
        role: u.Role,
        avatar: u.Avatar ? getAvatarUrl(u.Avatar) : "/img/admin-avatar.jpg", // Usar la ruta correcta
        registrationDate: u.RegistrationDate,
        lastLogin: u.LastLogin,
        isActive: u.IsActive === 1,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      setError("Error al obtener usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      fetchUsers(); // Vuelve a obtener los usuarios
      setEditingUser(null); // Cierra el modal después de la actualización
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  const handleUserDelete = async (userToDelete) => {
    try {
      await api.delete(`/users/${userToDelete.id}`);
      fetchUsers(); // Vuelve a obtener los usuarios
      setDeletingUser(null); // Cierra el modal después de la eliminación
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-indigo-50 p-6 rounded-xl shadow-lg border-l-4 border-indigo-500"
      >
        <h1 className="text-2xl font-bold text-indigo-800 mb-2">
          Panel de Administración
        </h1>
        <p className="text-indigo-600">
          Bienvenido al centro de control de la plataforma. Aquí puedes gestionar todos los aspectos del sistema.
        </p>
      </motion.div>

      <AdminStats
        metrics={[{ title: "Usuarios Activos", value: "1,234", change: "+5%" }, { title: "Cursos Publicados", value: "1", change: "+12%" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserManagementTable
          users={filteredUsers}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        <CourseManagement />
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleModalClose}
          onSave={handleUserUpdate}
        />
      )}

      {deletingUser && (
        <DeleteUsersModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleUserDelete}
        />
      )}
    </div>
  );
}
