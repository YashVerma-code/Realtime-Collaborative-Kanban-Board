import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_API_URL ||"htt";
console.log("Base api URL:", backendUrl);

export const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

