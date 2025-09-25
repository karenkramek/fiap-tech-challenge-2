import axios from 'axios';
import { AppConfig } from '../config/app.config';

const api = axios.create({
  baseURL: AppConfig.API_BASE_URL,
  timeout: AppConfig.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
