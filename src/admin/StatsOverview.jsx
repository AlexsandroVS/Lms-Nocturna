import { useState, useEffect } from "react";
import ModuleAveragesChart from "./charts/ModuleAveragesChart";
import LowPerformanceStudentsChart from "./charts/LowPerformanceStudentsChart";
import TopPerformanceStudentsChart from "./charts/TopPerformanceStudentsChart";
import LowCompletionActivitiesChart from "./charts/LowCompletionActivitiesChart";
import { useAuth } from "../context/AuthContext";

export default function StatsOverview() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const { api, currentUser } = useAuth();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        let response;
        if (currentUser?.role === "admin") {
          response = await api.get("/stats/courses"); 
        } else if (currentUser?.role === "teacher") {
          response = await api.get(`/stats/teacher/${currentUser.id}/courses`); // Solo los del docente
        }

        const fetchedCourses = response?.data || [];
        setCourses(fetchedCourses);

        if (fetchedCourses.length > 0) {
          setSelectedCourse(fetchedCourses[0].CourseID);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      }
    };

    loadCourses();
  }, [api, currentUser]);

  useEffect(() => {
    if (selectedCourse) {
      const loadCourseData = async () => {
        try {
          const [moduleAverages, lowPerformance, topPerformance, lowCompletion] = await Promise.all([
            api.get(`/stats/${selectedCourse}/module-averages`),
            api.get(`/stats/${selectedCourse}/low-performance-students`),
            api.get(`/stats/${selectedCourse}/top-performance-students`),
            api.get(`/stats/${selectedCourse}/low-completion-activities`)
          ]);

          setCourseData({
            moduleAverages: moduleAverages.data,
            lowPerformanceStudents: lowPerformance.data,
            topPerformanceStudents: topPerformance.data,
            lowCompletionActivities: lowCompletion.data,
          });
        } catch (error) {
          console.error("Error loading course data:", error);
        }
      };

      loadCourseData();
    }
  }, [selectedCourse, api]);

  return (
    <div className="space-y-6 px-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label htmlFor="course-select" className="block text-sm font-semibold text-gray-700 mb-2">
          Seleccionar Curso
        </label>
        <select
          id="course-select"
          value={selectedCourse || ""}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-slate-300 sm:text-base"
        >
          {courses.map((course) => (
            <option key={course.CourseID} value={course.CourseID}>
              {course.Title}
            </option>
          ))}
        </select>
      </div>

      {courseData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="min-h-[400px]">
              <ModuleAveragesChart data={courseData.moduleAverages} />
            </div>
            <div className="min-h-[400px]">
              <LowPerformanceStudentsChart data={courseData.lowPerformanceStudents} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="min-h-[400px]">
              <TopPerformanceStudentsChart data={courseData.topPerformanceStudents} />
            </div>
            <div className="min-h-[400px]">
              <LowCompletionActivitiesChart data={courseData.lowCompletionActivities} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
