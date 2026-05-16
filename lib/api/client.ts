import { create, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/auth.store";

export const api = create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
