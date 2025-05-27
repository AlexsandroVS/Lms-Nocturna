import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import UserCourseCard from "../components/courses/UserCourseCard";
import AdminCourses from "../admin/Acourses/AdminCourses";

export default function Courses() {
  const { currentUser, api, isAdmin, isTeacher } = useAuth();
  const [userCourses, setUserCourses] = useState([]);
  const [averages, setAverages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const [enrollRes, coursesRes] = await Promise.all([
          api.get(`/enrollments/student/${currentUser.id}/courses`),
          api.get("/courses"),
        ]);

        const enrolledCourseIds = enrollRes.data.courseIds || [];

        const filteredCourses = coursesRes.data.filter((course) =>
          enrolledCourseIds.includes(course.id)
        );

        const averageResults = {};
        await Promise.all(
          filteredCourses.map(async (course) => {
            try {
              const res = await api.get(
                `/averages/${course.id}courseid/${currentUser.id}userid`
              );
              averageResults[course.id] = res.data?.courseAverage || null;
            } catch {
              averageResults[course.id] = null;
            }
          })
        );

        setUserCourses(filteredCourses);
        setAverages(averageResults);
      } catch (err) {
        console.error(err);
        setError("Error al obtener los cursos.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && !isAdmin) {
      fetchEnrolledCourses();
    }
  }, [currentUser, api, isAdmin]);

  if (isAdmin) return <AdminCourses />;
  if (isTeacher) return <AdminCourses />;

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-purple-700 mb-2">
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
          Mis Cursos
        </h1>
        <p className="text-gray-600">
          Aquí puedes continuar tu aprendizaje en los cursos donde has
          comenzado.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC4899]"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 text-lg">{error}</div>
      ) : userCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {userCourses.map((course) => (
            <UserCourseCard
              key={course.id}
              course={course}
              average={averages[course.id]}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20">
          Aún no tienes cursos iniciados.
        </div>
      )}
    </div>
  );
}
