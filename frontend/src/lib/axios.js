import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8080/api";
console.log("Base URL:", backendUrl);

export const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    timeout: 30000, // 30 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message
        });
        
        // Better error messages for common issues
        if (error.code === 'ERR_NETWORK') {
            console.error('🌐 Network Error - Check if backend server is running');
        } else if (error.response?.status === 502) {
            console.error('🔧 Server Error - Backend is experiencing issues');
        }
        
        return Promise.reject(error);
    }
);
