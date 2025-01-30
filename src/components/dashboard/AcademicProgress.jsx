/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import {motion} from "framer-motion"
export default function AcademicProgress({ courses }) {
  // eslint-disable-next-line react/prop-types
  const average = Math.round(
    courses.reduce((acc, curr) => acc + curr.progress, 0) / courses.length
  );

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl overflow-auto h-64 scrollbar-custom"
    >
      <h2 className="font-semibold mb-4 text-[#003049] text-xl">Tu Avance Académico</h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-lg">
              <span style={{ color: course.color }}>{course.name}</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${course.progress}%`,
                  backgroundColor: course.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">Promedio general: {average}%</p>
    </motion.div>
  );
}
