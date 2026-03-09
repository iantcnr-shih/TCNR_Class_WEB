import axios from "axios"

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/TCNR_CLASS_API",
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.12.106:8000/TCNR_CLASS_API",
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://lohas.idv.tw/TCNR_CLASS_API",
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://10.140.241.130:8000",
  headers: {
    "Accept": "application/json",       // Laravel API 通常要這個
    "X-Requested-With": "XMLHttpRequest", // 保留
  },
  // withCredentials: true, // 如果用 token 登入就不用 cookie
});

// 自動帶上 Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token"); // <- 確認 key 與登入一致
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;