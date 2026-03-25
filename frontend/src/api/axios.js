import axios from 'axios';

const api = axios.create({
    // Si estás probando local, usá localhost. 
    // Si ya desplegaste el backend, acá va la URL de Railway/Render.
    baseURL: 'http://localhost:8080/api' 
});

// Este interceptor agarra el token del localStorage y lo mete en cada pedido
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;