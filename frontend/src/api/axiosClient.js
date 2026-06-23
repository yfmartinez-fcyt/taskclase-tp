import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:4000/api`;
  }

  return 'http://localhost:4000/api';
};

const axiosClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

// 🔐 TOKEN INTERCEPTOR (CORRECTO)
axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 LOGOUT CALLBACK
let logoutCallback = () => {
  sessionStorage.removeItem('accessToken');

  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const setLogoutCallback = (cb) => {
  logoutCallback = cb;
};

// 🔁 REFRESH LOGIC
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const isAuthError =
      error.response?.status === 401 ||
      error.response?.status === 403;

    const isLogin = originalRequest.url.includes('/auth/login');
    const isRefresh = originalRequest.url.includes('/auth/refresh');

    if (isAuthError && !originalRequest._retry && !isLogin && !isRefresh) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const baseURL = axiosClient.defaults.baseURL.replace(/\/$/, '');

        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        sessionStorage.setItem('accessToken', newToken);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logoutCallback();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || 'Error inesperado',
      status: error.response?.status || 500,
      data: error.response?.data || null,
    });
  }
);

export default axiosClient;