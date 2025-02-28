import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFile,
  faFileWord,
  faSpinner,
  faUserCircle,
  faFilePdf,
  faClock,
  faCheckCircle,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import RatingModal from "../admin/modals/Files/RatingModal"; // Modal para calificar

const FilesPage = () => {
  const { api, currentUser } = useAuth();
  const { activityId } = useParams();
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState(null);
  const [activityDetails, setActivityDetails] = useState({
    name: "",
    deadline: null,
  });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResp = await api.get("/users");
        const admins = usersResp.data.filter((user) => user.Role === "admin");
        const adminUserIds = admins.map((admin) => admin.UserID);

        const filesResp = await api.get(`/activities/${activityId}/files`);
        const activityResp = await api.get(`/activities/${activityId}`);
        const { Title: name, Deadline: deadline } = activityResp.data;

        // Filtrar los archivos de estudiantes (excluyendo los de los admins)
        const filteredFiles = filesResp.data.filter(
          (file) => !adminUserIds.includes(file.UserID)
        );

        // Obtener calificaciones de cada archivo
        const filesWithGrades = await Promise.all(filteredFiles.map(async (file) => {
          const gradeResp = await api.get(`/grades/user/${file.UserID}/activity/${activityId}`);
          const grade = gradeResp.data?.data || "N/A";
          return { ...file, grade };
        }));

        const filesWithUserInfo = filesWithGrades.map((file) => {
          const user = usersResp.data.find((u) => u.UserID === file.UserID);
          return { ...file, user };
        });

        setFiles(filesWithUserInfo);
        setActivityDetails({ name, deadline });
      } catch (error) {
        console.error("Error al obtener los archivos y usuarios:", error);
        setUploadError("Hubo un error al cargar los archivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activityId, api]);

  const isLate = (fileCreatedAt, deadline) => {
    const deadlineDate = new Date(deadline);
    const fileDate = new Date(fileCreatedAt);
    return fileDate > deadlineDate;
  };

  const handleDownload = async (file) => {
    try {
      setLoading(true);
      const response = await api.get(`/files/${file.FileID}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = file.FileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error al descargar el archivo");
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

  const handleOpenRatingModal = (file) => {
    setSelectedFile(file);
    setShowRatingModal(true);
  };

  const handleGradeFile = async (userId, activityId, score) => {
    try {
      const response = await api.post(`/grades/user/${userId}/activity/${activityId}`, { score });
  
      if (response.data.success) {
        alert("Calificación registrada correctamente.");
        // Actualizar la calificación del archivo en la interfaz de usuario
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.FileID === selectedFile.FileID ? { ...file, grade: score } : file
          )
        );
      }
    } catch (error) {
      console.error("Error al calificar el archivo:", error);
      alert("Hubo un error al calificar el archivo.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-xl">
      {/* Header */}
      <header className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">{activityDetails.name}</h1>
        <div className="flex justify-center gap-4 items-center">
          <p className="text-gray-600 text-sm">Fecha Límite:</p>
          <p className="text-blue-600 font-semibold">
            {new Date(activityDetails.deadline).toLocaleDateString()}
          </p>
        </div>
      </header>
  
      {/* Carga o error */}
      {loading ? (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faSpinner} spin size="lg" className="text-blue-600 mb-4" />
          <p className="text-gray-600">Cargando entregas...</p>
        </div>
      ) : uploadError ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
          {uploadError}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FontAwesomeIcon icon={faFile} className="text-5xl text-gray-400 mb-4" />
          <p className="text-gray-600">No se han subido archivos aún.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {files.map((file) => {
            const isFileLate = isLate(file.CreatedAt, activityDetails.deadline);
  
            return (
              <li
                key={file.FileID}
                className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Icono y nombre del archivo */}
                  <FontAwesomeIcon
                    icon={getFileIcon(file.FileType)}
                    className="text-4xl text-blue-600"
                  />
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{file.FileName}</p>
                    <p className="text-sm text-gray-500">{file.FileType}</p>
                    <p className="text-xs text-gray-500">Subido por: {file.user.Name}</p>
                  </div>
                </div>
  
                <div className="mt-3 flex items-center justify-between">
                  {/* Calificación */}
                  <div>
                    <p className="text-xs text-gray-600 mt-2">
                      <span className="font-semibold">Calificación:</span> {file.grade === "N/A" ? "N/A" : file.grade}
                    </p>
                  </div>
  
                  {/* Estado de la entrega */}
                  <div>
                    {isFileLate ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <FontAwesomeIcon icon={faClock} className="mr-1" />
                        Tardío
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        Entregado a tiempo
                      </span>
                    )}
                  </div>
  
                  {/* Acciones */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDownload(file)}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-2" />
                      Descargar
                    </button>
  
                    {currentUser?.role === "admin" && (
                      <button
                        onClick={() => handleOpenRatingModal(file)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Calificar
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
  
      {/* Modal para calificar */}
      {showRatingModal && selectedFile && (
        <RatingModal
          file={selectedFile}
          onClose={() => setShowRatingModal(false)}
          onSubmit={(score) => handleGradeFile(selectedFile.user.UserID, activityId, score)}
        />
      )}
    </div>
  );
  
};

export default FilesPage;
