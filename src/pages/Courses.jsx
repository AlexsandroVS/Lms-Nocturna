
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowRight, faPlay } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line react/prop-types
const CourseCard = ({ icon, color, title, description, progress, lastAccess }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition-all" style={{ minHeight: '220px' }}>
      <div className="flex justify-between items-start mb-4">
        <FontAwesomeIcon icon={icon} className={`text-2xl ${color}`} />
        <span className="text-sm text-gray-600 italic">{lastAccess}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="mb-4">
        <div className="w-full bg-gray-300 rounded-full h-2">
          <div className={`h-2 rounded-full ${color}`} style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm mt-1 text-gray-700">{progress}% Completado</p>
      </div>
      <button className={`w-full ${color} bg-opacity-80 hover:bg-opacity-100 py-2 rounded-lg transition-colors text-white`}> 
        {progress > 0 ? 'Continuar' : 'Comenzar'} <FontAwesomeIcon icon={progress > 0 ? faArrowRight : faPlay} className="ml-2" />
      </button>
    </div>
  );
};

const Courses = () => {
  const courses = [
    {
      icon: 'bolt',
      color: 'bg-blue-500',
      title: 'SEVA',
      description: 'Sistema Electrónico de Verificación Automática',
      progress: 65,
      lastAccess: 'Último acceso: 2d atrás'
    },
    {
      icon: 'robot',
      color: 'bg-green-500',
      title: 'Fabricación Digital',
      description: 'Tecnologías de producción asistida por computadora',
      progress: 22,
      lastAccess: 'Nuevo contenido'
    },
    {
      icon: 'book',
      color: 'bg-purple-500',
      title: 'Diseño Gráfico',
      description: 'Fundamentos de diseño y herramientas digitales',
      progress: 50,
      lastAccess: 'Último acceso: 1d atrás'
    },
    {
      icon: 'robot',
      color: 'bg-yellow-500',
      title: 'Robótica Básica',
      description: 'Introducción a la robótica y programación de robots',
      progress: 25,
      lastAccess: 'Nuevo contenido'
    }
  ];

  return (
    <section className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tus Cursos</h2>
        <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-gray-700">
          Ordenar por <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </section>
  );
};

export default Courses;
