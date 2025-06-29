import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
    withCredentials: true,
});