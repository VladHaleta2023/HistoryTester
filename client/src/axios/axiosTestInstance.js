import axios from 'axios';
import store from '../redux/store.js';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const axiosTestInstance = axios.create({
    baseURL: `${REACT_APP_API_URL}/test`,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

axiosTestInstance.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
},
(error) => {
    return Promise.reject(error);
});

export default axiosTestInstance;