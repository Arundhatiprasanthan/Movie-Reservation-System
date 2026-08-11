import axios from "axios";

/**
 * Single Axios instance used by every api/*.js module.
 *
 * BACKEND INTEGRATION
 * --------------------
 * - Base URL comes from VITE_API_BASE_URL (see .env.example). Point it at
 *   wherever the real API is hosted, e.g. http://localhost:4000/api.
 * - The auth token is read from localStorage under "cinevault_token" and
 *   attached as `Authorization: Bearer <token>` on every request. Swap this
 *   for cookies/sessions if that's how the backend auths — this is the only
 *   place that needs to change.
 * - A 401 response clears the stored session and redirects to "/", which
 *   re-opens the sign-in modal via AuthContext on next load.
 */

const TOKEN_KEY = "cinevault_token";

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}
