// src/api/api.js
import axios from "axios";

// Crea una instancia de Axios con una configuración base
const api = axios.create({
  // La URL base de tu API, la puedes configurar en una variable de entorno
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación (si lo necesitas)
api.interceptors.request.use(
  (config) => {
    // Ejemplo: obtener el token almacenado en localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores de forma global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar errores globales, por ejemplo:
    if (error.response && error.response.status === 401) {
      // Redirigir a login, limpiar token, etc.
      console.warn("No autorizado, redirigiendo al login...");
      // window.location.href = "/login"; // Ejemplo de redirección
    }
    return Promise.reject(error);
  }
);

export default api;
