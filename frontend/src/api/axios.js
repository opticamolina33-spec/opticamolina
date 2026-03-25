import axios from 'axios';

const api = axios.create({
    // Si estás en localhost usa el puerto 8080, sino usa la URL de Railway
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api' 
        : 'https://opticamolina-production.up.railway.app/api'
});

// Interceptor para el token (Fundamental para el Admin de la Óptica)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;