// src/components/AdminProfile/SearchBar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({ search, onSearch, icon }) => (
  <div className="flex items-center justify-end mb-4">
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar usuarios..."
        defaultValue={search}
        onChange={(e) => onSearch(e.target.value)}
        className="border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FontAwesomeIcon
        icon={icon}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
      />
    </div>
  </div>
);

export default SearchBar;
