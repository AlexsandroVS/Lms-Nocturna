/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const AdvancedFilters = ({
  search,
  setSearch,
  filterRole,
  setFilterRole,
  filterDateRange,
  setFilterDateRange,
}) => {
  const handleStartDateChange = (e) => {
    setFilterDateRange((prev) => ({ ...prev, start: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setFilterDateRange((prev) => ({ ...prev, end: e.target.value }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
      {/* Búsqueda */}
      <div className="flex items-center w-full md:w-auto">
        <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-64"
        />
      </div>
      {/* Filtro por rol */}
      <div className="flex items-center">
        <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          {/* Agrega más opciones si es necesario */}
        </select>
      </div>
      {/* Filtro por fecha: inicio */}
      <div className="flex items-center">
        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
        <input
          type="date"
          value={filterDateRange.start}
          onChange={handleStartDateChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Filtro por fecha: fin */}
      <div className="flex items-center">
        <input
          type="date"
          value={filterDateRange.end}
          onChange={handleEndDateChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
};

export default AdvancedFilters;
