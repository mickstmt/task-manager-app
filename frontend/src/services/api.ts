import axios from 'axios';

/**
 * Instancia de Axios configurada
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para requests
 * Aquí agregaremos el token JWT más adelante
 */
api.interceptors.request.use(
  (config) => {
    // TODO: Agregar token JWT cuando implementemos autenticación
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor para responses
 * Manejo global de errores
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores globalmente
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Network Error:', error.request);
    } else {
      // Algo más causó el error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;