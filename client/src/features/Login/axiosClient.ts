import axios from "axios";
import { setTokens, setUserId, logout } from "./authSlice";
import { store } from "../../store/store";
import type { TokenResponseDto } from "./types";

const api = axios.create({
  baseURL: "https://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Request interceptor – dodaje Authorization header
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  console.log("Interceptor token:", token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – refresh token kad dobijemo 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const state = store.getState().auth;
        const { refreshToken, userId } = state;

        // Koristi API instancu, ne direktni axios.post
        const response = await api.post<TokenResponseDto>("/login/refresh-token", {
          refreshToken,
          userId,
        });

        const newTokens = response.data;

        // Postavi i access/refresh token i userId
        store.dispatch(setTokens(newTokens));
        if (newTokens.userId) {
          store.dispatch(setUserId(newTokens.userId));
        }

        isRefreshing = false;
        onRefreshed(newTokens.accessToken);

        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
