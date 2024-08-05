import axios from 'axios';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'https://arbstrat.aordenes.com', // Cambia esto a la URL base de tu API
});

// Configurar interceptor de solicitud para agregar el token a cada solicitud
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Configurar interceptor de respuesta para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('authToken');
      // window.location.href = '/login'; // Redirigir al usuario a la página de inicio de sesión
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
