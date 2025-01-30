import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBookOpen, faCalendarAlt, faTrophy } from '@fortawesome/free-solid-svg-icons'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#d62828] p-4 flex flex-col">
      <div className="mb-8 p-4">
        <h2 className="text-2xl font-bold text-white/90">
          <span className="text-white">LMS</span> Nocturna
        </h2>
      </div>
      <nav className="space-y-2 flex-1">
        {[
          { icon: faHome, text: 'Inicio' },
          { icon: faBookOpen, text: 'Cursos' },
          { icon: faCalendarAlt, text: 'Calendario' },
          { icon: faTrophy, text: 'Logros' }
        ].map((item, index) => (
          <a 
            key={index} 
            href="#"
            className="flex items-center p-3 rounded-lg hover:bg-[#b32020] transition-colors duration-200"
          >
            <FontAwesomeIcon 
              icon={item.icon} 
              className="mr-3 text-white/80 hover:text-white"
            />
            <span className="text-white/90 hover:text-white">
              {item.text}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  )
}