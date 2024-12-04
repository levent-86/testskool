import axios, { AxiosInstance } from 'axios';
import { ContentType } from '../constants/headers';

/* Create axios instance */

const apiUrl = 'http://127.0.0.1:8000';
const BASE_URL = import.meta.env.VITE_API_URL || apiUrl;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': ContentType.JSON,
  },
});

export default api;
