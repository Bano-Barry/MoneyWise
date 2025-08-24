import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://moneywise-backend-187q.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token JWT à chaque requête
// Interceptor to add JWT token on each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export { api };
import api from '../services/api';
