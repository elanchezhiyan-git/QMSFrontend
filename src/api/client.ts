import axios, {AxiosInstance, AxiosResponse} from "axios";
import {ApiResponse} from "../types";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/private/auth/refresh")) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Avoid multiple refresh API calls
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = client.post("/private/auth/refresh");
                }

                await refreshPromise;
                isRefreshing = false;
                refreshPromise = null;

                // Retry original request AFTER refresh succeeds
                return client(originalRequest);

            } catch (refreshError) {
                isRefreshing = false;
                refreshPromise = null;

                window.location.href = "/auth/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
