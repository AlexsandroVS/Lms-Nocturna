import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FilesPage = () => {
  const { api } = useAuth();
  const { activityId } = useParams(); // Obtén el activityId de la URL
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(`/activities/${activityId}/files`);
        setFiles(response.data);
      } catch (error) {
        console.error("Error al obtener los archivos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [activityId, api]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Archivos Subidos para la Actividad {activityId}
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Cargando archivos...</div>
      ) : files.length === 0 ? (
        <div className="text-center text-gray-500">No se han subido archivos aún.</div>
      ) : (
        <ul className="space-y-4">
          {files.map((file) => (
            <li key={file.FileID} className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between">
              <div>
                <strong className="text-lg text-gray-900">{file.FileName}</strong>
                <p className="text-gray-500 text-sm">{file.FileType}</p>
              </div>
              <a
                href={`/files/${file.FileID}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Descargar
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilesPage;
