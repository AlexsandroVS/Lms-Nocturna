/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

function StatusMessage({ status }) {
  return (
    <AnimatePresence>
      {status.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`p-3 rounded-lg flex items-center gap-2 ${
            status.type === "success"
              ? "bg-green-500/20 border border-green-500"
              : "bg-red-500/20 border border-red-500"
          }`}
        >
          <FontAwesomeIcon
            icon={status.type === "success" ? faCheckCircle : faTimesCircle}
            className={`text-xl ${
              status.type === "success" ? "text-green-500" : "text-red-500"
            }`}
          />
          <span
            className={`text-sm ${
              status.type === "success" ? "text-green-200" : "text-red-200"
            }`}
          >
            {status.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StatusMessage;
