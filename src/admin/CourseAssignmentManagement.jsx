import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  faTimes
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

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes, assignmentsRes, enrollmentsRes] = await Promise.all([
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
      const assignment = assignments.find((a) => a.CourseID === Number(selectedCourseId));
      if (!assignment) return alert("Debe asignar primero un docente a este curso");
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
    setExpandedAssignment(expandedAssignment === assignmentId ? null : assignmentId);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.CourseTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         assignment.TeacherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredStudents = students.filter(student => 
    student.Name.toLowerCase().includes(studentSearch.toLowerCase())
  );

return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8 p-4 max-w-7xl mx-auto"
    >
      {/* Sección de Asignaciones - Rediseñada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asignar Docente - Card rediseñada */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm p-6 space-y-5 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Asignar Curso a Docente</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Curso</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl ring-1 ring-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Docente</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-4 py-3 ring-1 ring-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un docente</option>
                {teachers.map((t) => (
                  <option key={t.UserID} value={t.UserID}>{t.Name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAssignTeacher}
              disabled={!selectedCourseId || !selectedTeacherId}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
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

        {/* Asignar Estudiante - Card rediseñada */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm p-6 space-y-5 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <FontAwesomeIcon icon={faUserGraduate} className="text-xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Asignar Estudiante a Curso</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Curso</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full px-4 py-3 bg-white ring-1 ring-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Estudiante</label>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300    pl-11 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xs"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-4 text-gray-400" />
              </div>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-4 py-3 ring-1 ring-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none shadow-xs"
              >
                <option value="">Selecciona un estudiante</option>
                {filteredStudents.map((s) => (
                  <option key={s.UserID} value={s.UserID}>{s.Name}</option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAssignStudent}
              disabled={!selectedCourseId || !selectedStudentId}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
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

      {/* Lista de Asignaciones - Tabla rediseñada */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 mr-3">
                <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Asignaciones Actuales</h2>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Buscar curso o docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-3.5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-xs">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Curso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Docente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Estudiantes</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((a) => {
                    const alumnos = enrollments.filter(e => e.AssignmentID === a.AssignmentID);
                    const isExpanded = expandedAssignment === a.AssignmentID;
                    
                    return (
                      <React.Fragment key={a.AssignmentID}>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{a.CourseTitle}</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <FontAwesomeIcon icon={faUser} className="text-sm" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{a.TeacherName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-3">
                                {alumnos.length} estudiante{alumnos.length !== 1 ? 's' : ''}
                              </span>
                              <button
                                onClick={() => toggleAssignmentExpansion(a.AssignmentID)}
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
                              >
                                {isExpanded ? 'Ocultar' : 'Ver'} 
                                <FontAwesomeIcon 
                                  icon={isExpanded ? faChevronUp : faChevronDown} 
                                  className="ml-1 text-xs" 
                                />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(a.AssignmentID)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-2" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                        
                        {isExpanded && (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 bg-gray-50/30">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {alumnos.length > 0 ? (
                                  alumnos.map(e => (
                                    <div key={e.EnrollmentID} className="bg-white p-4 rounded-xl shadow-xs flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                        <FontAwesomeIcon icon={faUser} className="text-sm" />
                                      </div>
                                      <span className="text-sm font-medium text-gray-800">{e.StudentName}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-gray-500 text-sm flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 opacity-50" />
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
                        <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-gray-300 mb-3" />
                        <p className="text-lg font-medium">No se encontraron asignaciones</p>
                        <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}