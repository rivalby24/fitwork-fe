// api.ts
import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const securedApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

securedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const plainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export { securedApi, plainApi };
