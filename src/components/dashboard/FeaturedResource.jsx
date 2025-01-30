import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'

export default function FeaturedResource() {
  return (
    <motion.div
    initial={{scale:0.9}}
    animate={{scale:1}}
     className="bg-white p-6 rounded-xl shadow-xl">
      <h2 className="font-semibold mb-4 text-xl text-[#003049]">📚 Recurso Destacado</h2>
      <div className="bg-[#f8f9fa] p-4 rounded-lg">
        <p className="font-medium text-lg mb-2 text-[#003049]">Guía de Seguridad Industrial</p>
        <p className="text-md text-gray-500 mb-4">Documento esencial para el curso de SEVA</p>
        <button className="text-[#48cae4] text-md flex items-center hover:text-[#3aa3c4]">
          <FontAwesomeIcon icon={faDownload} className="mr-2 " /> Descargar PDF
        </button>
      </div>
    </motion.div>
  )
}