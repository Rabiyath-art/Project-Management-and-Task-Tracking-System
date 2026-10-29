
import axios from "axios";

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL || "NEXT_PUBLIC_API_URL=https://project-management-and-task-tracking-9ypw.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export default api;
