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
  faUsers,
  faBook,
  faChartLine,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const baseUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api', '') 
  : "http://localhost:5000";

const getAvatarUrl = (avatar) => {
  if (!avatar) return "/img/default-avatar.png";
  return avatar.startsWith("http") ? avatar : `${baseUrl}${avatar}`;
};

export default function AdminDashboard() {
  const { api, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check immediately
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      if (!currentUser) {
        console.warn("No hay usuario actual definido");
        setUsers([]);
        setLoading(false);
        return;
      }

      if (currentUser.role === "teacher") {
        // Get students assigned to this teacher
        const res = await api.get(
          `/assignments/teacher/${currentUser.id}/students`
        );
        const studentsData = res.data;

        // Transform the data to match the user structure
        const transformedStudents = studentsData.map((student) => ({
          id: student.StudentID,
          name: student.StudentName.trim(),
          email: student.StudentEmail,
          role: student.StudentRole,

          avatar: getAvatarUrl(student.StudentAvatar),
          registrationDate: new Date(
            student.RegistrationDate
          ).toLocaleDateString(),
        }));

        // Remove duplicates (in case a student is in multiple courses)
        const uniqueStudents = transformedStudents.filter(
          (student, index, self) =>
            index === self.findIndex((s) => s.id === student.id)
        );

        setUsers(uniqueStudents);
      } else {
        // Admin or other roles: show all users
        const resUsers = await api.get("/users");
        // Transform admin users data to match the same structure
        const adminUsers = resUsers.data.map((user) => ({
          id: user.UserID,
          name: user.Name,
          email: user.Email,
          role: user.Role,

          avatar: getAvatarUrl(user.Avatar),
          registrationDate: new Date(
            user.RegistrationDate
          ).toLocaleDateString(),
        }));
        setUsers(adminUsers);
      }
    } catch (error) {
      console.error("Error en fetchUsers:", error);
      setError("Error al cargar los usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

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

  const tabs = [
    { label: "Usuarios", key: "users", icon: faUsers },
    ...(currentUser?.role !== "teacher"
      ? [{ label: "Cursos", key: "assignments", icon: faBook }]
      : []),
    { label: "Estadísticas", key: "stats", icon: faChartLine },
  ];

  // Filtro de búsqueda seguro, evita error si algún campo es undefined o no es string
  const filteredUsers = users.filter((user) => {
    const name = user.name?.toString().toLowerCase() || "";
    const email = user.email?.toString().toLowerCase() || "";
    const role = user.role?.toString().toLowerCase() || "";
    const term = search.toLowerCase();
    return name.includes(term) || email.includes(term) || role.includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 text-white"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">
          Panel de Administración
        </h1>
        <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
          Gestión de usuarios, cursos y estadísticas
        </p>
      </motion.div>

      {/* Tabs Desktop */}
      {!isMobile && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(({ label, key, icon }) => (
            <motion.button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition ${
                activeTab === key
                  ? "bg-purple-700 text-white"
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
      )}

      {/* Tabs Mobile fixed bottom */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50 shadow-md">
          {tabs.map(({ label, key, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center text-xs sm:text-sm font-semibold ${
                activeTab === key ? "text-purple-700" : "text-gray-500"
              }`}
            >
              <FontAwesomeIcon icon={icon} className="text-lg mb-1" />
              {label}
            </button>
          ))}
        </nav>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "users" && (
          <motion.div
            key="users-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 overflow-x-auto"
          >
            <div className="flex flex-col md:flex-row justify-between mb-4 sm:mb-6 gap-3">
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
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg focus:outline-0 focus:border-0 focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10 sm:py-20">
                Cargando usuarios...
              </div>
            ) : error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-10 sm:py-20 text-gray-500">
                No se encontraron usuarios.
              </div>
            ) : (
              <UserManagementTable
                users={filteredUsers}
                currentUser={currentUser}
                onEdit={setEditingUser}
                onDelete={setDeletingUser}
                onCreate={
                  currentUser.role === "admin"
                    ? () => setShowCreateUserModal(true)
                    : null
                }
                isMobile={isMobile}
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
          >
            <StatsOverview />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modales */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
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
      {showCreateUserModal && (
        <CreateUsersModal
          onClose={() => setShowCreateUserModal(false)}
          onSave={handleUserCreate}
        />
      )}
    </div>
  );
}
