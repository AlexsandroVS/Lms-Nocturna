import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faBookOpen, faClock, faUser, faGraduationCap, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import StatCard from "./StatCard";
import CourseProgressCard from "./CourseProgressCard";
import AchievementCard from "./ArchivementCard";
import defaultAvatar from "../../../public/img/admin-avatar.jpg";
import { profileVariants, itemVariants, colorPalette } from "../../utils/profileUtils";

const SERVER_URL = "http://localhost:5000";

// Función para construir la URL del avatar
const getAvatarUrl = (avatar) => {
  if (!avatar) return defaultAvatar;
  return avatar.startsWith("http") ? avatar : `${SERVER_URL}${avatar}`;
};

const UserProfile = () => {
  const { currentUser, setCurrentUser, api } = useAuth();
  const fileInputRef = useRef(null);

  // Estado local para el formulario de edición
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    avatar: getAvatarUrl(currentUser?.avatar),
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);  // Nuevo estado para cursos
  const [averageProgress, setAverageProgress] = useState(0); // Nuevo estado para el promedio de progreso
  const [totalStudyHours, setTotalStudyHours] = useState(0); // Nuevo estado para las horas totales de estudio

  // Sincroniza el formulario con currentUser cuando éste cambia
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        avatar: getAvatarUrl(currentUser.avatar),
      });
    }

    // Obtener todos los cursos de la API
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");  // Obtener todos los cursos
        setCourses(response.data);  // Guardar los cursos en el estado

        // Calcular el promedio de progreso de cada curso y las horas de estudio
        let totalProgress = 0;
        let courseCount = 0;
        let totalDurationHours = 0;
        
        for (const course of response.data) {
          const courseAverageResponse = await api.get(
            `/grades/user/${currentUser.id}/course/${course.id}/averages`
          );
          const courseAverage = courseAverageResponse.data.data.courseAverage * 5; // Convertir la nota a porcentaje
          totalProgress += courseAverage;
          totalDurationHours += course.durationHours; // Sumar las horas de estudio
          courseCount++;
        }

        // Calcular el promedio general de progreso
        const average = totalProgress / courseCount;
        setAverageProgress(average.toFixed()); 

        // Establecer el total de horas de estudio
        setTotalStudyHours(totalDurationHours);

      } catch (err) {
        console.error("Error al obtener los cursos:", err);
      }
    };

    fetchCourses();  // Llamada para obtener cursos
  }, [currentUser, api]);

  // Manejador para cambios en inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para cambio del avatar (archivo)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Para previsualización usamos FileReader y convertimos a base64
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejador para guardar cambios
  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (fileInputRef.current.files[0]) {
        data.append("avatar", fileInputRef.current.files[0]);
      }
      const response = await api.put(`/users/${currentUser.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = response.data.user;
      updatedUser.avatar = getAvatarUrl(updatedUser.avatar);

      // Actualiza el estado global y local sin perder datos
      setCurrentUser(prev => ({ ...prev, ...updatedUser }));
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      });
      setEditing(false);

      // Recargar la página para asegurar que se vean los cambios
      window.location.reload(); // Recarga la página

    } catch (err) {
      setError("Error al actualizar perfil");
      console.error("Error en handleSave:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={profileVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto p-1"
    >
      {/* Header del Perfil */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white/20 object-cover"
            />
            {editing && (
              <>
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current.click()}
                >
                  <FontAwesomeIcon icon={faEdit} className="text-2xl text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
          {/* Datos del Usuario */}
          <div className="flex-1">
            {editing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="text-4xl font-bold bg-transparent border-b border-white outline-none text-white w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="text-lg bg-transparent border-b border-white outline-none text-white w-full mt-2"
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold">{formData.name}</h1>
                <p className="text-white/90">{formData.email}</p>
              </>
            )}
          </div>
          {/* Botón de Editar/Guardar */}
          <div>
            <button
              onClick={editing ? handleSave : () => setEditing(true)}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4"
            >
              {editing ? (loading ? "Guardando..." : "Guardar") : "Editar"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </motion.div>

      {/* Estadísticas Rápidas */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          icon={faUser}
          title="Progreso General"
          value={`${averageProgress}%`} 
          color={colorPalette.primary}
        />
        <StatCard
          icon={faGraduationCap}
          title="Cursos Completados"
          value={currentUser.stats?.completedCourses || 0}
          color={colorPalette.neutral}
        />
        <StatCard
          icon={faClock}
          title="Horas de Estudio"
          value={totalStudyHours || 0}
          color={colorPalette.secondary}
        />
      </motion.div>

      {/* Contenido Principal: Cursos y Logros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cursos en Progreso */}
        <motion.div
          variants={itemVariants}
          className="bg-white h-80 scrollbar-custom overflow-auto rounded-2xl shadow-xl p-6 border-t-4"
        >
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-3"
            style={{ color: colorPalette.primary }}
          >
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-3xl transition-transform hover:scale-110"
            />
            Cursos en Progreso
            <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
              {courses.length} activos
            </span>
          </h2>
          <div className="space-y-4">
            {courses.map((course, index) => (
              <CourseProgressCard
                key={course.id}
                course={course}
                index={index}
                accentColor={colorPalette.primary}
              />
            ))}
          </div>
        </motion.div>
        {/* Últimos Logros */}
        
      </div>
    </motion.div>
  );
};

export default UserProfile;
