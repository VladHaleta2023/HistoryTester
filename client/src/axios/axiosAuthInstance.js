import axios from 'axios';
import store from '../redux/store.js';

const axiosAuthInstance = axios.create({
    baseURL: `=https://historytester.onrender.com/api/auth`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAuthInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
});

export default axiosAuthInstance;