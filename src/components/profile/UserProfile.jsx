import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faGraduationCap,
  faUser,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import StatCard from "./StatCard";
import defaultAvatar from "../../../public/img/admin-avatar.jpg";


const SERVER_URL = "http://localhost:5000";

export default function UserProfile() {
  const { currentUser, setCurrentUser, api } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    interests: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState(0);
  const [averageScore, setAverageScore] = useState(null);

  // 👉 Carga de número de cursos y promedio
useEffect(() => {
  if (!currentUser) return;

  (async () => {
    try {
      // 🔹 1. Obtener cursos inscritos
      const coursesRes = await api.get(
        `/enrollments/student/${currentUser.id}/courses`
      );
      const totalCursos = coursesRes.data.courseIds.length || 0;
      setEnrolledCourses(totalCursos);
 

      // 🔹 2. Obtener promedio general
      const avgRes = await api.get(`/averages/overall/${currentUser.id}`);
      const data = avgRes.data;


      const promedioValido =
        data && typeof data.courseAverage === "number";

      setAverageScore(
        promedioValido ? data.courseAverage.toFixed(1) : "N/A"
      );
    } catch (e) {
      console.error("❌ Error al obtener cursos o promedio:", e);
      setAverageScore("N/A");
      setEnrolledCourses(0);
    }
  })();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentUser]);


  // 👉 Inicializa el formulario con datos de usuario
useEffect(() => {
  if (!currentUser) return;

  const avatarUrl = !currentUser.avatar
    ? defaultAvatar
    : currentUser.avatar.startsWith("http")
    ? currentUser.avatar
    : `${SERVER_URL}${currentUser.avatar}`;

  setFormData({
    name: currentUser.name || "",
    email: currentUser.email || "",
    avatar: avatarUrl,
    bio: currentUser.bio || currentUser.biografia || "", // ✅
    interests: currentUser.interests || currentUser.intereses || "",
  });
}, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData((p) => ({ ...p, avatar: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("bio", formData.bio);
      form.append("interests", formData.interests);
      if (imageFile) form.append("avatar", imageFile);

      const res = await api.put(`/users/${currentUser.id}`, form);
      const updated = res.data.user;
      updated.avatar = updated.avatar?.startsWith("http")
        ? updated.avatar
        : `${SERVER_URL}${updated.avatar}`;
      updated.bio = updated.bio || updated.biografia;
      updated.interests = updated.interests || updated.intereses;
      setCurrentUser(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Error al guardar cambios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 bg-gray-50">
      {/* ================= Encabezado ================= */}
      <motion.div
        className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl shadow-xs border-l-4 border-[#6802C1]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Avatar */}
        <div className="relative self-start group flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-1 shadow-inner">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {editing && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current.click()}
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: 1,
                  background: "rgba(59, 130, 246, 0.2)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white p-3 rounded-full shadow-md">
                  <FontAwesomeIcon icon={faEdit} className="text-blue-600" />
                </div>
              </motion.div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>

        {/* Info usuario */}
        <div className="flex-1 space-y-5">
          {editing ? (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-bold w-full bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Tu nombre"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-gray-600 w-full bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="tu@email.com"
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800">
                {formData.name}
              </h1>
              <p className="text-gray-500">{formData.email}</p>
            </>
          )}

          <div className="flex items-center gap-3">
            <motion.button
              onClick={editing ? handleSave : () => setEditing(true)}
              disabled={loading}
              className={`px-5 py-2.5 text-white font-medium rounded-lg transition-all flex items-center gap-2 ${
                editing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-[#6802C1] hover:bg-[#8257a7]"
              } ${loading ? "opacity-80" : ""}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {editing ? (
                "Guardar cambios"
              ) : (
                <>
                  <FontAwesomeIcon icon={faEdit} /> Editar perfil
                </>
              )}
            </motion.button>
            {editing && (
              <motion.button
                onClick={() => setEditing(false)}
                className="px-4 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Cancelar
              </motion.button>
            )}
            {error && (
              <motion.p
                className="text-red-500 text-sm px-3 py-1 bg-red-50 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ================= StatCards + Gráfico ================= */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard
          icon={faGraduationCap}
          title="Cursos Inscritos"
          value={enrolledCourses}
          color="#B272FD"
        />

        <StatCard
          icon={faUser}
          title="Promedio General"
          value={averageScore}
          color="#B272FD"
        />

      </motion.div>

      {/* ================= Bio e Intereses ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">
              Acerca de mí
            </h3>
            {editing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="ml-auto"
              >
                <FontAwesomeIcon
                  icon={faPen}
                  className="text-gray-500 hover:text-purple-500"
                />
              </motion.button>
            )}
          </div>

          <textarea
            value={formData.bio}
            name="bio"
            onChange={handleChange}
            disabled={!editing}
            className={`w-full p-3 rounded-lg text-sm outline-none transition-all border ${
              editing
                ? "bg-white focus:ring-2 focus:ring-purple-200 border-purple-100"
                : "bg-gray-50 border-transparent"
            }`}
            placeholder="Cuéntanos sobre ti..."
            rows={4}
          />
        </motion.div>
      </div>
    </div>
  );
}
