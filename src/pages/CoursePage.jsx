/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBookOpen, faVideo, faTasks, faCertificate } from '@fortawesome/free-solid-svg-icons';

const CourseDetail = ({ course }) => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header del curso */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-red-100 text-lg">{course.description}</p>
          </div>
          <div className="text-white text-right">
            <div className="flex items-center space-x-2 mb-2">
              <FontAwesomeIcon icon={faClock} className="text-xl" />
              <span>Duración: {course.duration}</span>
            </div>
            <div className="bg-white text-red-600 px-4 py-2 rounded-full font-semibold">
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
            <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-red-600" />
            Módulos del Curso
          </h2>

          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-600">
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
                  <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors">
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
              <FontAwesomeIcon icon={faTasks} className="mr-3 text-red-600" />
              Tu Progreso
            </h3>
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-red-600"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Completado</span>
                <span>{course.progress}%</span>
              </div>
            </div>
          </div>

          {/* Certificación */}
          

          {/* Recursos adicionales */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Recursos Adicionales</h3>
            <ul className="space-y-2">
              {course.resources.map((resource, index) => (
                <li key={index} className="text-red-600 hover:text-red-700">
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

// Ejemplo de uso
const courseData = {
  id: 1,
  title: 'SEVA - Sistema Electrónico de Verificación Automática',
  description: 'Domina el sistema de verificación automatizada más utilizado en la industria.',
  duration: '15 horas',
  progress: 65,
  modules: [
    {
      title: 'Introducción a SEVA',
      lessons: 5,
      duration: '2h 30m',
      completed: true
    },
    {
      title: 'Configuración del sistema',
      lessons: 8,
      duration: '4h 15m',
      completed: false
    },
    // ... más módulos
  ],
  resources: [
    {
      title: 'Manual de usuario SEVA',
      icon: 'file-pdf',
      link: '#'
    },
    {
      title: 'Casos de estudio',
      icon: 'book',
      link: '#'
    }
    // ... más recursos
  ]
};

const CoursePage = () => {
  return <CourseDetail course={courseData} />;
};

export default CoursePage;