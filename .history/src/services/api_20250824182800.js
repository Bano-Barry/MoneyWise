import axios from "axios";
//utilisation   
const api = axios.create({
  baseURL: "https://moneywise-backend-187q.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;