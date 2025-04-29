import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
