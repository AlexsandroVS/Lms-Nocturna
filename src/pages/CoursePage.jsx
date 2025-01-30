/* eslint-disable react/prop-types */
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faVideo, faTasks } from '@fortawesome/free-solid-svg-icons';
import courses from '../data/courses';

const CourseDetail = ({ course }) => {
  const courseColor = course?.color || '#48CAE4';

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header del curso */}
      <div 
        className="rounded-xl p-8 mb-8 shadow-lg"
        style={{ background: `linear-gradient(to bottom, ${courseColor}, ${courseColor}90)` }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-white text-opacity-90 text-lg">{course.description}</p>
          </div>
          <div className="text-white text-center md:text-right">
            <div className="flex items-center space-x-2 mb-2 justify-center md:justify-end">
              <FontAwesomeIcon icon={faClock} className="text-xl" />
              <span>Duración: {course.duration}</span>
            </div>
            <div 
              className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-semibold backdrop-blur-sm"
              style={{ color: courseColor }}
            >
              Progreso: {course.progress}%
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sección de módulos */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FontAwesomeIcon 
              icon={course.icon}
              className="mr-3 text-3xl"
              style={{ color: courseColor }}
            />
            Módulos del Curso
          </h2>

          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faVideo} className="mr-2" />
                        {module.lessons} lecciones
                      </span>
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {module.duration}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="px-6 py-2 rounded-full text-white font-medium"
                    style={{ backgroundColor: courseColor }}
                  >
                    Ver módulo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar de información */}
        <div className="space-y-6">
          {/* Progreso */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FontAwesomeIcon 
                icon={faTasks}
                className="mr-3"
                style={{ color: courseColor }}
              />
              Tu Progreso
            </h3>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${course.progress}%`,
                    backgroundColor: courseColor
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Completado</span>
                <span>{course.progress}%</span>
              </div>
            </div>
          </div>

          {/* Recursos adicionales */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Recursos Adicionales</h3>
            <ul className="space-y-3">
              {course.resources.map((resource, index) => (
                <li 
                  key={index} 
                  className="hover:underline transition-colors"
                  style={{ color: courseColor }}
                >
                  <a href={resource.link} className="flex items-center">
                    <FontAwesomeIcon icon={resource.icon} className="mr-2" />
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursePage = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === Number(id));

  if (!course) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Curso no encontrado
      </div>
    );
  }

  return <CourseDetail course={course} />;
};

export default CoursePage;