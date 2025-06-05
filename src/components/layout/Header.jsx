import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-8 flex justify-between items-center"
    >
      <div className="relative w-3xl">

      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <FontAwesomeIcon icon={faBell} className="text-[#003049]" />
        </button>
        <div className="h-8 w-8 bg-[#fcbf49] rounded-full"></div>
      </div>
    </motion.header>
  );
}
