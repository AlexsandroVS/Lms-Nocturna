import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const RatingModal = ({ file, onClose, onSubmit }) => {
  const [score, setScore] = useState(""); // Estado para almacenar la calificación
  const [error, setError] = useState(null);

  // Validar la calificación
  const handleSubmit = () => {
    if (score === "" || isNaN(score) || score < 0 || score > 20) {
      setError("La calificación debe ser un número entre 0 y 20.");
      return;
    }
    onSubmit(score); // Llamar a la función para enviar la calificación
    onClose(); // Cerrar el modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Calificar Actividad
        </h2>

        <div className="mb-4">
          <p className="text-lg font-medium text-gray-700">Archivo: {file.FileName}</p>
          <p className="text-sm text-gray-500">Subido por: {file.user.Name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium" htmlFor="score">
            Calificación (0 - 20):
          </label>
          <input
            type="number"
            id="score"
            name="score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            max="20"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Calificar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
