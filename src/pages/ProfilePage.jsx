import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGraduationCap,
  faClock,
  faTrophy,
  faEdit,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { AchievementCard } from "../components/profile/ArchivementCard";
import { StatCard } from "../components/profile/StatCard";
import { CourseProgressCard } from "../components/profile/CourseProgressCard";
import { useAuth } from "../context/AuthContext";
import courses from "../data/courses";

const profileVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ProfilePage = () => {
  const { currentUser } = useAuth();
  console.log("Current User:", currentUser); // Verifica en la consola

  if (!currentUser) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Por favor inicia sesión para ver tu perfil
      </div>
    );
  }
  const userCourses = courses.filter((c) =>
    currentUser.enrolledCourses?.includes(c.id)
  );

  // Paleta de colores coherente con el navbar rojo (#d62828)
  const colorPalette = {
    primary: "#d62828",
    secondary: "#f77f00",
    accent: "#fcbf49",
    neutral: "#003049",
    light: "#eae2b7",
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
        style={{
          background: `linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group cursor-pointer"
          >
            <motion.img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white/20 object-cover"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FontAwesomeIcon
                icon={faEdit}
                className="text-2xl text-white/80 hover:text-white transition-colors p-2 bg-red-600 rounded-full"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex-1"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              {currentUser.name}
              <motion.span
                className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium"
                whileHover={{ scale: 1.05 }}
                style={{ color: colorPalette.light }}
              >
                {currentUser.role === "admin" ? "Administrador" : "Estudiante"}
              </motion.span>
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <p className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {currentUser.email}
              </p>
              {currentUser.registrationDate && (
                <p className="text-sm bg-white/10 px-3 py-1 rounded-full">
                  {currentUser.registrationDate}
                </p>
              )}
            </div>
          </motion.div>
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
          value={`${currentUser.stats?.progress || 0}%`}
          color={colorPalette.primary}
          gradient={`linear-gradient(135deg, ${colorPalette.primary} 0%, ${colorPalette.secondary} 100%)`}
        />
        <StatCard
          icon={faGraduationCap}
          title="Cursos Completados"
          value={currentUser.stats?.completedCourses || 0}
          color={colorPalette.neutral}
          gradient={`linear-gradient(135deg, ${colorPalette.neutral} 0%, #002233 100%)`}
        />
        <StatCard
          icon={faClock}
          title="Horas de Estudio"
          value={currentUser.stats?.learningHours || 0}
          color={colorPalette.secondary}
          gradient={`linear-gradient(135deg, ${colorPalette.secondary} 0%, #ff9a00 100%)`}
        />
        <StatCard
          icon={faTrophy}
          title="Logros Obtenidos"
          value={currentUser.achievements?.length || 0}
          color={colorPalette.accent}
          gradient={`linear-gradient(135deg, ${colorPalette.accent} 0%, #fbbf24 100%)`}
        />
      </motion.div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cursos Activos */}
        <motion.div
          variants={itemVariants}
          className="bg-white h-80 scrollbar-custom overflow-auto rounded-2xl shadow-xl p-6 border-t-4"
          style={{ borderColor: colorPalette.primary }}
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
              {userCourses.length} activos
            </span>
          </h2>
          <div className="space-y-4">
            {userCourses.map((course, index) => (
              <CourseProgressCard
                key={course.id}
                course={course}
                index={index}
                accentColor={colorPalette.primary}
              />
            ))}
          </div>
        </motion.div>

        {/* Logros */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-6 border-t-4"
          style={{ borderColor: colorPalette.accent }}
        >
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-3"
            style={{ color: colorPalette.accent }}
          >
            <FontAwesomeIcon
              icon={faTrophy}
              className="text-3xl transition-transform hover:scale-110"
            />
            Últimos Logros
            <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {currentUser.achievements?.length || 0} obtenidos
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {currentUser.achievements?.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                accentColor={colorPalette.accent}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
