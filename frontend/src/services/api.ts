import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ContentType } from '../constants/headers';
import { BaseURLS } from '../constants/base-urls';

/* Create axios instance */

const api: AxiosInstance = axios.create({
  baseURL: BaseURLS.API,
  headers: {
    'Content-Type': ContentType.JSON,
  },
});


// Interceptor for access token 
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
