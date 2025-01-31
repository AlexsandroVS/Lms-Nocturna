/* eslint-disable react/prop-types */
import {motion} from  "framer-motion" 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
export const AchievementCard = ({ achievement, index }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.2 }}
      whileHover={{ rotate: 2, scale: 1.05 }}
      className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl text-center border-2 border-dashed"
      style={{ borderColor: achievement.color }}
    >
      <FontAwesomeIcon 
        icon={achievement.icon} 
        className="text-4xl mb-3" 
        style={{ color: achievement.color }}
      />
      <p className="font-medium text-gray-900">{achievement.title}</p>
      <p className="text-sm text-gray-600 mt-1">
        Obtenido: {new Date(achievement.unlockedAt).toLocaleDateString()}
      </p>
    </motion.div>
  );