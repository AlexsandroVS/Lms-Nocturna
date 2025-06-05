import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChalkboardTeacher,
  faBookOpen,
  faTrash,
  faUserGraduate,
  faUser,
  faSearch,
  faChevronDown,
  faChevronUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function CourseAssignmentManagement() {
  const { api } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check immediately
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes, assignmentsRes, enrollmentsRes] =
        await Promise.all([
          api.get("/courses"),
          api.get("/users"),
          api.get("/assignments"),
          api.get("/enrollments"),
        ]);

      setCourses(coursesRes.data);
      setAssignments(assignmentsRes.data);
      setEnrollments(enrollmentsRes.data);
      setTeachers(usersRes.data.filter((u) => u.Role === "teacher"));
      setStudents(usersRes.data.filter((u) => u.Role === "student"));
    } catch (err) {
      console.error("Error al obtener datos:", err);
    }
  };

  const handleAssignTeacher = async () => {
    if (!selectedCourseId || !selectedTeacherId) return;
    try {
      await api.post("/assignments", {
        courseId: selectedCourseId,
        teacherId: selectedTeacherId,
      });
      setSelectedCourseId("");
      setSelectedTeacherId("");
      await fetchData();
    } catch (err) {
      console.error("Error al asignar curso:", err);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedCourseId || !selectedStudentId) return;
    try {
      const assignment = assignments.find(
        (a) => a.CourseID === Number(selectedCourseId)
      );
      if (!assignment)
        return alert("Debe asignar primero un docente a este curso");
      await api.post("/enrollments", {
        assignmentId: assignment.AssignmentID,
        studentId: selectedStudentId,
      });
      setSelectedStudentId("");
      await fetchData();
    } catch (err) {
      console.error("Error al asignar estudiante:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      await fetchData();
    } catch (err) {
      console.error("Error al eliminar asignación:", err);
    }
  };

  const toggleAssignmentExpansion = (assignmentId) => {
    setExpandedAssignment(
      expandedAssignment === assignmentId ? null : assignmentId
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.CourseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.TeacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredStudents = students.filter((student) =>
    student.Name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 max-w-7xl mx-auto"
    >
      {/* Sección de Asignaciones - Versión responsiva */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Asignar Docente - Card optimizada para móviles */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl  p-4 sm:p-6 space-y-4  transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-100 text-purple-600">
              <FontAwesomeIcon
                icon={faChalkboardTeacher}
                className="text-lg sm:text-xl"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Asignar Docente
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Curso
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white rounded-lg sm:rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Docente
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ring-1 ring-slate-300 bg-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un docente</option>
                {teachers.map((t) => (
                  <option key={t.UserID} value={t.UserID}>
                    {t.Name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignTeacher}
              disabled={!selectedCourseId || !selectedTeacherId}
              className={`w-full py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                !selectedCourseId || !selectedTeacherId
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Asignar Docente
            </button>
          </div>
        </div>

        {/* Asignar Estudiante - Card optimizada para móviles */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl  p-4 sm:p-6 space-y-4  transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-indigo-100 text-indigo-600">
              <FontAwesomeIcon
                icon={faUserGraduate}
                className="text-lg sm:text-xl"
              />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Asignar Estudiante
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Curso
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white ring-1 ring-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">
                Estudiante
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ring-1 ring-slate-300 bg-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un estudiante</option>
                {filteredStudents.map((s) => (
                  <option key={s.UserID} value={s.UserID}>
                    {s.Name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignStudent}
              disabled={!selectedCourseId || !selectedStudentId}
              className={`w-full py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                !selectedCourseId || !selectedStudentId
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg"
              }`}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Asignar Estudiante
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Asignaciones - Versión responsiva */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-100 text-blue-600 mr-2 sm:mr-3">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="text-base sm:text-lg"
                />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Asignaciones
              </h2>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 bg-white rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-2.5 sm:top-3.5 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 sm:top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {isMobile ? (
            /* Versión móvil - Lista de cards */
            <div className="space-y-3">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((a) => {
                  const alumnos = enrollments.filter(
                    (e) => e.AssignmentID === a.AssignmentID
                  );
                  const isExpanded = expandedAssignment === a.AssignmentID;

                  return (
                    <div
                      key={a.AssignmentID}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {a.CourseTitle}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 flex items-center">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-purple-500 mr-2"
                            />
                            {a.TeacherName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {alumnos.length} estudiante
                            {alumnos.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              toggleAssignmentExpansion(a.AssignmentID)
                            }
                            className="text-blue-500 hover:text-blue-700 p-1"
                          >
                            <FontAwesomeIcon
                              icon={isExpanded ? faChevronUp : faChevronDown}
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(a.AssignmentID)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                          >
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Estudiantes:
                            </h4>
                            <div className="space-y-2">
                              {alumnos.length > 0 ? (
                                alumnos.map((e) => (
                                  <div
                                    key={e.EnrollmentID}
                                    className="bg-white p-3 rounded-lg shadow-xs flex items-center"
                                  >
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="text-xs"
                                      />
                                    </div>
                                    <span className="text-sm text-gray-800">
                                      {e.StudentName}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-500 text-sm flex items-center">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="mr-2 opacity-50"
                                  />
                                  No hay estudiantes asignados
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 flex flex-col items-center justify-center">
                    <FontAwesomeIcon
                      icon={faBookOpen}
                      className="text-3xl text-gray-300 mb-3"
                    />
                    <p className="text-sm sm:text-base font-medium">
                      No se encontraron asignaciones
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Versión desktop - Tabla */
            <div className="overflow-x-auto rounded-lg shadow-xs">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Docente
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Estudiantes
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((a) => {
                      const alumnos = enrollments.filter(
                        (e) => e.AssignmentID === a.AssignmentID
                      );
                      const isExpanded = expandedAssignment === a.AssignmentID;

                      return (
                        <React.Fragment key={a.AssignmentID}>
                          <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {a.CourseTitle}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-sm"
                                  />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {a.TeacherName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-3">
                                  {alumnos.length} estudiante
                                  {alumnos.length !== 1 ? "s" : ""}
                                </span>
                                <button
                                  onClick={() =>
                                    toggleAssignmentExpansion(a.AssignmentID)
                                  }
                                  className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
                                >
                                  {isExpanded ? "Ocultar" : "Ver"}
                                  <FontAwesomeIcon
                                    icon={
                                      isExpanded ? faChevronUp : faChevronDown
                                    }
                                    className="ml-1 text-xs"
                                  />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleDelete(a.AssignmentID)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors flex items-center"
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="mr-1 sm:mr-2"
                                />
                                Eliminar
                              </button>
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-4 sm:px-6 py-4 bg-gray-50/30"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {alumnos.length > 0 ? (
                                    alumnos.map((e) => (
                                      <div
                                        key={e.EnrollmentID}
                                        className="bg-white p-3 sm:p-4 rounded-lg shadow-xs flex items-center"
                                      >
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                          <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-sm"
                                          />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                          {e.StudentName}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-gray-500 text-sm flex items-center">
                                      <FontAwesomeIcon
                                        icon={faUser}
                                        className="mr-2 opacity-50"
                                      />
                                      No hay estudiantes asignados
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center">
                        <div className="text-gray-500 flex flex-col items-center justify-center">
                          <FontAwesomeIcon
                            icon={faBookOpen}
                            className="text-3xl text-gray-300 mb-3"
                          />
                          <p className="text-sm sm:text-base font-medium">
                            No se encontraron asignaciones
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
