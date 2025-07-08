import axios from "axios";

const backendUrl=import.meta.env.VITE_BACKEND_API_URL ||"http://localhost:8080/api";
console.log("Base URL : ",backendUrl);
export const axiosInstance=axios.create({
    baseURL:backendUrl,
    withCredentials:true
})
