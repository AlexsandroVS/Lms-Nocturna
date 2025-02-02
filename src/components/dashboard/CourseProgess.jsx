/* eslint-disable react/prop-types */
import ProgressBar from "../ui/ProgressBar";

function CourseProgress({ courses }) {
  const averageProgress = Math.round(
    courses.reduce((acc, curr) => acc + curr.progress, 0) / courses.length
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="font-semibold mb-4 text-[#003049]">Tu Avance Académico</h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: course.color }}>{course.name}</span>
              <span>{course.progress}%</span>
            </div>
            <ProgressBar progress={course.progress} color={course.color} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Promedio general: {averageProgress}%
      </p>
    </div>
  );
}

export default CourseProgress;
