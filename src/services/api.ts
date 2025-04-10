import axios from 'axios';
import { getApiBaseUrl } from '../config/environment';

// Crear una instancia de axios con la configuración base
const api = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token y la URL base a todas las peticiones
api.interceptors.request.use(
  (config) => {
    // Actualizar la URL base en cada petición
    config.baseURL = getApiBaseUrl();
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el error es 401 (No autorizado), redirigir al login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_expires_at');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 