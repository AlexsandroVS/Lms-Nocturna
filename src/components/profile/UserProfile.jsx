import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUser,
  faClock,
  faGraduationCap,
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
  });

  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [averageProgress, setAverageProgress] = useState(0);
  const [studyHours, setStudyHours] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const avatarUrl = !currentUser.avatar
        ? defaultAvatar
        : currentUser.avatar.startsWith("http")
        ? currentUser.avatar
        : `${SERVER_URL}${currentUser.avatar}`;

      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        avatar: avatarUrl,
        bio: currentUser.bio || "",
      });
    }

    const fetchProgress = async () => {
      try {
        const res = await api.get(`/progress/${currentUser.id}`);
        const uniqueCourses = [...new Set(res.data.map((p) => p.CourseID))];
        setAverageProgress(Math.round((uniqueCourses.length / 10) * 100));
        setStudyHours(uniqueCourses.length * 5);
      } catch (e) {
        console.error("Error al cargar progreso:", e);
      }
    };

    fetchProgress();
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
      if (imageFile) form.append("avatar", imageFile);

      const res = await api.put(`/users/${currentUser.id}`, form);
      const updated = res.data.user;
      updated.avatar = updated.avatar?.startsWith("http")
        ? updated.avatar
        : `${SERVER_URL}${updated.avatar}`;
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
      {/* Encabezado */}
      <motion.div
        className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-2xl shadow-xs border-l-4 border-[#FF5A5F]"
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
                  background: 'rgba(59, 130, 246, 0.2)'
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

        {/* Info */}
        <div className="flex-1 space-y-5">
          {editing ? (
            <>
              <div className="relative">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-2xl font-bold w-full bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Tu nombre"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-200 scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform"></div>
              </div>
              <div className="relative">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-gray-600 w-full bg-gray-50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="tu@email.com"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-200 scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform"></div>
              </div>
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
                  ? "bg-green-500 hover:bg-green-600 shadow-green-sm"
                  : "bg-[#FF5A5F] hover:bg-[#AD4C4B] shadow-blue-sm"
              } shadow-sm ${loading ? "opacity-80" : ""}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {editing ? (
                loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )
              ) : (
                <>
                  <FontAwesomeIcon icon={faEdit} className="text-sm" />
                  Editar perfil
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

      {/* Estadísticas */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard 
          icon={faUser} 
          title="Progreso" 
          value={`${averageProgress}%`} 
          color="#FF5A5F"
          indicator={
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-100 overflow-hidden rounded-b-lg">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${averageProgress}%` }}
              ></div>
            </div>
          }
        />
        <StatCard 
          icon={faGraduationCap} 
          title="Cursos Iniciados" 
          value={Math.floor(averageProgress / 10)} 
          color="#00C07F"
        />
        <StatCard 
          icon={faClock} 
          title="Horas Totales" 
          value={studyHours} 
          color="#FF9F1C"
        />
      </motion.div>

      {/* Bio e Intereses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Bio - Sección mejorada */}
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 space-y-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-2 h-6 bg-red-500 rounded-full"></div>
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
            className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer" 
          />
        </motion.button>
      )}
    </div>
    
    {editing ? (
      <div className="relative group">
        <textarea
          rows={4}
          value={formData.bio}
          name="bio"
          onChange={handleChange}
          className="w-full p-3 bg-red-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-200 transition-all border border-red-100"
          placeholder="Cuéntanos sobre ti, tus intereses y objetivos..."
        />
        <div className="absolute bottom-2 left-3 right-3 h-0.5 bg-red-200 scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform"></div>
      </div>
    ) : (
      <p className="text-sm text-gray-700 leading-relaxed bg-red-50/30 p-3 rounded-lg">
        {formData.bio || (
          <span className="text-gray-500 italic">Sin descripción aún. Haz clic en Editar perfil para añadir una biografía.</span>
        )}
      </p>
    )}
  </motion.div>

  {/* Intereses - Sección mejorada */}
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500 space-y-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-2 h-6 bg-red-500 rounded-full"></div>
      <h3 className="text-lg font-semibold text-gray-800">
        Intereses
      </h3>
    </div>
    
    <div className="flex flex-wrap gap-3">
      {["Programación", "Diseño UI/UX", "JavaScript", "Aprendizaje continuo", "React", "Node.js"].map((interest) => (
        <motion.span
          key={interest}
          className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg font-medium hover:bg-red-100 hover:text-red-800 transition-colors cursor-default flex items-center gap-2"
          whileHover={{ scale: 1.05, boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          {interest}
        </motion.span>
      ))}
      
      {editing && (
        <motion.button 
          className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-lg font-medium hover:bg-red-100 hover:text-red-700 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          Añadir
        </motion.button>
      )}
    </div>
  </motion.div>
</div>
    </div>
  );
}