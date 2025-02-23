import axios from 'axios';
import store from '../redux/store.js';
import getAxiosURL from './axiosURL.js';

const axiosTestInstance = axios.create({
    baseURL: `${getAxiosURL()}/test`,
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