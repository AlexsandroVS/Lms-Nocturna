import { motion } from "framer-motion";
// eslint-disable-next-line no-unused-vars
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGraduationCap, faClock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { StatCard } from "../profile/StatCard";
import { useAuth } from "../../context/AuthContext";
import { colorPalette } from "../../utils/profileUtils";

const ProfileStats = () => {
  const { currentUser } = useAuth();

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={faUser}
        title="Progreso General"
        value={`${currentUser.stats?.progress || 0}%`}
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
        value={currentUser.stats?.learningHours || 0}
        color={colorPalette.secondary}
      />
      <StatCard
        icon={faTrophy}
        title="Logros Obtenidos"
        value={currentUser.achievements?.length || 0}
        color={colorPalette.accent}
      />
    </motion.div>
  );
};
export default ProfileStats;