/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {motion} from "framer-motion"

export const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl p-6 flex items-center gap-4 text-white shadow-lg"
      style={{ backgroundColor: color }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <FontAwesomeIcon 
        icon={icon} 
        className="text-3xl text-white/90" 
      />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm opacity-90">{title}</p>
      </div>
    </motion.div>
  );
  