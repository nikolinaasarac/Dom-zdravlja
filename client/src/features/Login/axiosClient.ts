import axios from "axios";
import { setTokens, logout } from "./authSlice";
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
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// Dodaj Authorization header ako postoji
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Osvježavanje tokena kad istekne
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ako token istekao
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Čekaj dok refresh ne završi
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

        const response = await axios.post<TokenResponseDto>(
          "https://localhost:5001/api/login/refresh-token",
          { refreshToken, userId }
        );

        const newTokens = response.data;
        store.dispatch(setTokens(newTokens));
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
