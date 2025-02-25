import axios from "axios";

const BASE_URL=import.meta.env.VITE_BACKEND_URL;

const api=axios.create({
    baseURL:BASE_URL,
    headers:{'Content-Type':'application/json'},
    withCredentials:true
});

export default api;