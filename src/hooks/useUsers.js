// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import defaultAvatar from '../assets/admin-avatar.jpg';

const SERVER_URL = "http://localhost:5000";

// Función para construir la URL completa del avatar
const getAvatarUrl = (avatar) => {
  if (!avatar) return defaultAvatar;
  return avatar.startsWith("http") ? avatar : `${SERVER_URL}${avatar}`;
};

const useUsers = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Memoriza la función para evitar recrearla en cada render
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      const mappedUsers = response.data.map((u) => ({
        id: u.UserID,
        name: u.Name,
        email: u.Email,
        role: u.Role,
        avatar: getAvatarUrl(u.Avatar),
        registrationDate: u.RegistrationDate,
        lastLogin: u.LastLogin,
        isActive: u.isActive,
      }));
      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
      setError("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Ejecuta fetchUsers al montar el componente o cuando cambie fetchUsers
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers };
};

export default useUsers;
