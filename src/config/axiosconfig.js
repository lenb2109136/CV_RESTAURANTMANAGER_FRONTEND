import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:8080', 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tokenRequiredPaths = [];
    const isTokenRequired = tokenRequiredPaths.some((path) => config.url.includes(path));
    
    if (token && isTokenRequired) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;
