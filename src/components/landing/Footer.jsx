const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-12  px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">LMS Educativo</h3>
            <p className="text-gray-400">
              Plataforma de aprendizaje en línea con los mejores cursos para impulsar tu carrera.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Cursos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Todos los cursos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Nuevos lanzamientos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Categorías</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Compañía</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Sobre nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Términos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Centro de ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Políticas</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} LMS Educativo. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;