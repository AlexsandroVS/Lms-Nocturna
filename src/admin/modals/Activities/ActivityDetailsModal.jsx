/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTimes,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const ActivityDetailsModal = ({ activity, onClose }) => {
  const { api, currentUser } = useAuth();
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams(); // Obtener courseId y moduleId de los parámetros
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  useEffect(() => {
    // Cargar archivos subidos por los usuarios
    const fetchFiles = async () => {
      try {
        const response = await api.get(
          `/activities/${activity.ActivityID}/files`
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error al obtener los archivos:", error);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [activity.ActivityID]);

  const handleFileUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Asegúrate de que `activity.ActivityID` esté correctamente configurado en el frontend
      await api.post(
        `/courses/${courseId}/modules/${moduleId}/activities/${activity.ActivityID}/files`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Actualizar la lista de archivos después de subir uno nuevo
      setFiles((prevFiles) => [...prevFiles, { fileName: file.name }]);
      alert("Archivo subido con éxito");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };  
  const redirectToUserFiles = () => {
    navigate(`/files/${activity.ActivityID}`); // Redirigir a la página de archivos subidos por usuarios
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl w-full relative overflow-hidden transition-all transform-gpu">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200 transform hover:scale-110"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        {/* Título */}
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Detalles de la Actividad
        </h2>

        <div className="mb-4">
          <strong className="text-gray-700">Título:</strong>
          <p className="text-lg text-gray-800">{activity.Title}</p>
        </div>
        <div className="mb-4">
          <strong className="text-gray-700">Descripción:</strong>
          <p className="text-lg text-gray-800">{activity.Description}</p>
        </div>

        <div className="mb-6">
          <strong className="text-gray-700">Archivo Subido:</strong>
          {activity.FileName ? (
            <a
              href={`/files/${activity.FileID}`}
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar
            </a>
          ) : (
            <p className="text-gray-600 italic">
              No se ha subido un archivo aún.
            </p>
          )}
        </div>

        {currentUser?.role === "admin" && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Archivos Subidos por Usuarios:
            </h3>
            {loadingFiles ? (
              <p className="text-gray-600">Cargando archivos...</p>
            ) : files.length > 0 ? (
              <ul className="list-disc pl-6">
                {files.map((file, index) => (
                  <li key={index} className="text-gray-700 text-lg">
                    {file.fileName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                No hay archivos subidos por los usuarios.
              </p>
            )}
            <button
              onClick={redirectToUserFiles}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
              Ver Archivos Subidos
            </button>
          </div>
        )}

        {currentUser?.role !== "admin" && (
          <div className="mt-6 flex flex-col items-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Subir Tarea (Archivo):
            </h3>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="p-2 border border-gray-300 rounded-lg w-full max-w-xs"
            />
            <button
              onClick={handleFileUpload}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Subir Archivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
