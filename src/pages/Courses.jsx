
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faArrowRight, faPlay } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line react/prop-types
const CourseCard = ({ icon, color, title, description, progress, lastAccess }) => {
  return (
    <div className="group bg-white shadow-lg rounded-xl p-8 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 cursor-pointer h-[320px] flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-6">
          <FontAwesomeIcon 
            icon={icon} 
            className={`text-3xl ${color} transition-transform duration-300 group-hover:scale-110`} 
          />
          <span className="text-sm text-gray-600 font-medium">{lastAccess}</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-6 text-base leading-relaxed">{description}</p>
      </div>
      
      <div>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${color} transition-all duration-500 ease-out`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2 text-gray-600 font-medium">{progress}% Completado</p>
        </div>
        <button className={`w-full ${color} bg-opacity-90 hover:bg-opacity-100 py-3 rounded-xl 
          transition-all duration-300 text-white font-semibold flex items-center justify-center
          hover:scale-[1.02] hover:shadow-md`}>
          {progress > 0 ? 'Continuar' : 'Comenzar'}
          <FontAwesomeIcon 
            icon={progress > 0 ? faArrowRight : faPlay} 
            className="ml-3 transition-transform duration-300 group-hover:translate-x-1" 
          />
        </button>
      </div>
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
    <section className="p-8 max-w-7xl mx-auto">
      <div className="mb-12 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Tus Cursos</h2>
        <button className="bg-gray-100 px-5 py-2.5 rounded-xl hover:bg-gray-200 
          transition-colors duration-300 text-gray-700 font-medium flex items-center">
          Ordenar por 
          <FontAwesomeIcon icon={faChevronDown} className="ml-3 transition-transform duration-200" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </section>
  );
};

export default Courses;
