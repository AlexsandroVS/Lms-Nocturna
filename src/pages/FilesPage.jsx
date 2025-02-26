import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFile,
  faFileWord,
  faSpinner,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

const FilesPage = () => {
  const { api } = useAuth();
  const { activityId } = useParams(); // Obtén el activityId de la URL
  const [files, setFiles] = useState([]);
  const [activityName, setActivityName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState(null);

  // Cargar archivos, actividad y usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los usuarios
        const usersResp = await api.get("/users");

        // Filtrar usuarios para obtener solo los administradores
        const admins = usersResp.data.filter((user) => user.Role === "admin");
        const adminUserIds = admins.map((admin) => admin.UserID); // Obtener los UserID de los admins

        // Obtener los archivos para la actividad
        const filesResp = await api.get(`/activities/${activityId}/files`);

        // Filtrar los archivos para que no se muestren los subidos por administradores
        const filteredFiles = filesResp.data.filter(
          (file) => !adminUserIds.includes(file.UserID)
        );

        // Ahora asociamos la información del usuario con cada archivo
        const filesWithUserInfo = filteredFiles.map((file) => {
          const user = usersResp.data.find((u) => u.UserID === file.UserID);
          return {
            ...file,
            user, // Asociamos los datos del usuario al archivo
          };
        });

        // Obtener el nombre de la actividad
        const activityResp = await api.get(`/activities/${activityId}`);
        setActivityName(activityResp.data.Title);

        setFiles(filesWithUserInfo); // Establecer los archivos con la información del usuario
        setUsers(usersResp.data); // Establecer la lista de usuarios
      } catch (error) {
        console.error("Error al obtener los archivos y usuarios:", error);
        setUploadError("Hubo un error al cargar los archivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activityId, api]);

  // Función para descargar los archivos
  const handleDownload = async (file) => {
    try {
      setLoading(true);

      // Realiza la solicitud al servidor para descargar el archivo usando `api`
      const response = await api.get(`/files/${file.FileID}`, {
        responseType: "blob", // Indica que la respuesta es un archivo binario
      });

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.FileName; // Usa el nombre original del archivo
      document.body.appendChild(link);
      link.click();

      // Limpia el enlace temporal
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("Hubo un error al descargar el archivo. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Obtener el ícono correspondiente al tipo de archivo
  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return faFilePdf;
    } else if (
      fileType === "application/msword" ||
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return faFileWord;
    } else {
      return faFile;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Archivos Subidos para la Actividad: {activityName || activityId}
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">
          <FontAwesomeIcon icon={faSpinner} spin size="lg" />
          Cargando archivos...
        </div>
      ) : uploadError ? (
        <div className="text-center text-red-500">{uploadError}</div>
      ) : files.length === 0 ? (
        <div className="text-center text-gray-500">
          No se han subido archivos aún.
        </div>
      ) : (
        <ul className="space-y-6">
          {files.map((file) => (
            <li
              key={file.FileID}
              className="p-5 bg-white border border-gray-300 shadow-md rounded-lg flex items-center justify-between hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <FontAwesomeIcon
                  icon={getFileIcon(file.FileType)}
                  className="text-3xl text-gray-600"
                />
                <div>
                  <strong className="text-xl text-gray-900">
                    {file.FileName}
                  </strong>
                  <p className="text-sm text-gray-600">{file.FileType}</p>
                  <p className="text-xs text-gray-500">
                    Subido por:{" "}
                    <span className="font-semibold">{file.user.Name}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(file)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Descargar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilesPage;
