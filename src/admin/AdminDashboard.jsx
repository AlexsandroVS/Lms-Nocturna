/* eslint-disable react-hooks/exhaustive-deps */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import StatsOverview from "./StatsOverview";
import UserManagementTable from "./UserManagementTable";
import CourseAssignmentManagement from "./CourseAssignmentManagement";
import EditUserModal from "./modals/EditUserModal";
import DeleteUsersModal from "./modals/DeleteUsersModal";
import CreateUsersModal from "./modals/CreateUsersModal";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faUsers,
  faBook,
  faChartLine,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const SERVER_URL = "http://localhost:5000";
const getAvatarUrl = (avatar) => {
  if (!avatar) return "/img/default-avatar.png";
  return avatar.startsWith("http") ? avatar : `${SERVER_URL}${avatar}`;
};

export default function AdminDashboard() {
  const { api, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState([]);
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
        avatar: getAvatarUrl(u.Avatar),
        registrationDate: new Date(u.RegistrationDate).toLocaleDateString(),
        lastLogin: u.LastLogin
          ? new Date(u.LastLogin).toLocaleString()
          : "Nunca",
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

  const handleUserUpdate = async (updatedUser) => {
    try {
      await api.put(`/users/${updatedUser.id}`, updatedUser);
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleUserDelete = async (userToDelete) => {
    try {
      await api.delete(`/users/${userToDelete.id}`);
      await fetchUsers();
      setDeletingUser(null);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUserCreate = async (newUser) => {
    try {
      await api.post("/users", newUser);
      await fetchUsers();
      setShowCreateUserModal(false);
    } catch (err) {
      console.error("Error al crear usuario:", err);
      alert("Error al crear usuario");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg p-6 mb-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="mt-2 opacity-90">
              Gestión de usuarios, cursos y estadísticas
            </p>
          </div>
          <motion.div
            whileHover={{ rotate: 15 }}
            className="bg-white bg-opacity-20 p-3 rounded-full"
          >
            <FontAwesomeIcon icon={faCog} className="text-2xl text-gray-950" />
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { label: "Gestión de Usuarios", key: "users", icon: faUsers },
          { label: "Asignación de Cursos", key: "assignments", icon: faBook },
          { label: "Estadísticas", key: "stats", icon: faChartLine },
        ].map(({ label, key, icon }) => (
          <motion.button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === key
                ? "bg-purple-700 text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <FontAwesomeIcon icon={icon} className="mr-2" />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "users" && (
          <motion.div
            key="users-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-0 focus:border-0 focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">Cargando usuarios...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <UserManagementTable
                users={filteredUsers}
                onEdit={isAdmin ? setEditingUser : null}
                onDelete={isAdmin ? setDeletingUser : null}
                onCreate={isAdmin ? () => setShowCreateUserModal(true) : null}
              />
            )}
          </motion.div>
        )}

        {activeTab === "assignments" && (
          <motion.div
            key="assignments-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <CourseAssignmentManagement />
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div
            key="stats-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <StatsOverview />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales */}
      <AnimatePresence>
        {isAdmin && editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={handleUserUpdate}
          />
        )}
        {isAdmin && deletingUser && (
          <DeleteUsersModal
            user={deletingUser}
            onClose={() => setDeletingUser(null)}
            onConfirm={handleUserDelete}
          />
        )}
        {isAdmin && showCreateUserModal && (
          <CreateUsersModal
            onClose={() => setShowCreateUserModal(false)}
            onSave={handleUserCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
