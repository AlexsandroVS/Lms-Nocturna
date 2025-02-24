/* eslint-disable react/prop-types */
// src/admin/Aprofile/DashboardSummary.jsx
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserPlus, faChartPie } from "@fortawesome/free-solid-svg-icons";

const DashboardSummary = ({ users }) => {
  // Usuarios activos: aquellos con isActive === true
  const activeUsers = useMemo(() => {
    return users.filter((user) => user.isActive).length;
  }, [users]);

  // Nuevos registros esta semana: usuarios con RegistrationDate en los últimos 7 días
  const newRegistrations = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return users.filter(
      (user) => user.registrationDate && new Date(user.registrationDate) >= oneWeekAgo
    ).length;
  }, [users]);

  // Distribución de roles: cuenta de cada rol
  const roleDistribution = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        const role = user.role.toLowerCase();
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      { admin: 0, teacher: 0, student: 0 }
    );
  }, [users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Usuarios Activos */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center">
        <div className="p-3 bg-blue-500 rounded-full text-white">
          <FontAwesomeIcon icon={faUsers} size="lg" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500">Usuarios Activos</p>
          <p className="text-2xl font-bold">{activeUsers}</p>
        </div>
      </div>
      {/* Nuevos Registros */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center">
        <div className="p-3 bg-green-500 rounded-full text-white">
          <FontAwesomeIcon icon={faUserPlus} size="lg" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500">Nuevos Registros Esta Semana</p>
          <p className="text-2xl font-bold">{newRegistrations}</p>
        </div>
      </div>
      {/* Distribución de Roles */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center">
        <div className="p-3 bg-purple-500 rounded-full text-white">
          <FontAwesomeIcon icon={faChartPie} size="lg" />
        </div>
        <div className="ml-4">
          <p className="text-gray-500">Distribución de Roles</p>
          <p className="text-sm">
            | <span className="font-bold">Profesores:</span> {roleDistribution.admin}{" "}
            | <span className="font-bold">Estudiantes:</span> {roleDistribution.student}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
