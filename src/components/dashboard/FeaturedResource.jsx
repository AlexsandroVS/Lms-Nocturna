import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import resources from "../../data/resources";

const FeaturedResource = () => {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white p-6 rounded-xl shadow-xl"
    >
      <h2 className="font-semibold mb-4 text-xl text-[#003049]">
        📚 Recursos Destacados
      </h2>
      <div className="space-y-4">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="bg-[#f8f9fa] p-4 rounded-lg transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={resource.type === "pdf" ? faFilePdf : faFileWord}
                className={`text-2xl mt-1 ${
                  resource.type === "pdf" ? "text-red-500" : "text-blue-500"
                }`}
              />
              <div className="flex-1">
                <p className="font-medium text-lg text-[#003049]">
                  {resource.title}
                </p>
                <p className="text-md text-gray-500">{resource.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-400">{resource.size}</span>
                  <a
                    href={resource.file}
                    download
                    className="text-[#48cae4] hover:text-[#3aa3c4] transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Descargar {resource.type.toUpperCase()}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FeaturedResource;
