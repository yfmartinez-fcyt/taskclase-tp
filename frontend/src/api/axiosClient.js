import axios from 'axios';

/**
 * Axios es una librería cliente HTTP basada en promesas para el navegador y node.js.
 * Nos permite realizar peticiones a servicios REST de forma sencilla.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
  withCredentials: true // Importante para enviar cookies (Refresh Token)
});

// Interceptor de peticiones: Adjuntar el token si existe
axiosClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas: Manejar renovación de token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos un 401 y no hemos reintentado todavía
    // Y NO es una petición de login (para evitar bucles o refrescos innecesarios en login)
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        // Intentar obtener un nuevo access token usando el refresh token (cookie)
        // Usamos una URL limpia para evitar problemas con barras diagonales dobles
        const baseURL = axiosClient.defaults.baseURL.endsWith('/') 
          ? axiosClient.defaults.baseURL.slice(0, -1) 
          : axiosClient.defaults.baseURL;
          
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data.success) {
          const newToken = res.data.accessToken;
          sessionStorage.setItem('accessToken', newToken);
          
          // Actualizar el header y reintentar la petición original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        // Si el refresh también falla, el usuario debe loguearse de nuevo (cerrar sesión)
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const customError = {
      message: error.response?.data?.message || 'Ocurrió un error inesperado',
      status: error.response?.status || 500,
      data: error.response?.data || null
    };

    return Promise.reject(customError);
  }
);

export default axiosClient;
