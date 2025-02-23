import axios from 'axios';
import store from '../redux/store.js';
import getAxiosURL from './axiosURL.js';

const axiosAuthInstance = axios.create({
    baseURL: `${getAxiosURL()}/auth`,
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