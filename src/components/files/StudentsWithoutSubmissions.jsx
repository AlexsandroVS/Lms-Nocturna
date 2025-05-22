/* eslint-disable react/prop-types */
// src/components/files/StudentsWithoutSubmissions.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserClock } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const StudentsWithoutSubmissions = ({ students }) => {
  if (!students || students.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <div className="px-6 py-5 bg-gradient-to-r from-purple-100 to-indigo-100 border-b border-purple-200">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800">
          <FontAwesomeIcon icon={faUserClock} className="text-purple-500" />
          Estudiantes sin entregar ({students.length})
        </h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {students.map((user) => (
            <motion.div
              key={user.UserID}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-lg font-semibold text-purple-600">
                  {user.Name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 truncate">
                    {user.Name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {user.Email}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentsWithoutSubmissions;
