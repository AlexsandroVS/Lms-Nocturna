/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

function InputField({
  type,
  placeholder,
  value,
  onChange,
  disabled,
  icon,
  inputStyle,
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div
        className={`flex rounded-xl overflow-hidden shadow-sm ${inputStyle}`}
      >
        <div className="w-14 bg-[#d62828] flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-white focus:outline-none"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </motion.div>
  );
}

export default InputField;
