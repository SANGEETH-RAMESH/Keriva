import axios from "axios";
import store from "../redux/store";
import { loginSuccess as adminLoginSuccess, logout as adminLogout } from "../redux/adminAuthSlice";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const accessTokenKey = "adminAccessToken";
const refreshTokenKey = "adminRefreshToken";

const createAdminApiClient = () => {
  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // REQUEST INTERCEPTOR
  api.interceptors.request.use(
    (req) => {
      const accessToken = localStorage.getItem(accessTokenKey);
      if (accessToken) {
        req.headers.Authorization = `Bearer ${accessToken}`;
      }
      return req;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (!originalRequest) return Promise.reject(error);

      // Handle 401 - Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem(refreshTokenKey);
          if (!refreshToken) throw new Error("Refresh token missing");

          const { data } = await axios.post(`${apiUrl}/admin/token/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = data.message;

          // Update localStorage
          localStorage.setItem(accessTokenKey, accessToken);
          localStorage.setItem(refreshTokenKey, newRefreshToken);

          // Update Redux state
          store.dispatch(
            adminLoginSuccess({
              accessToken,
              refreshToken: newRefreshToken,
              isLoggedIn: true,
            })
          );

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch(adminLogout({ isLoggedIn: false }));
          localStorage.removeItem(accessTokenKey);
          localStorage.removeItem(refreshTokenKey);
          return Promise.reject(refreshError);
        }
      }

      // Handle 403 - Forbidden
      if (error.response?.status === 403) {
        store.dispatch(adminLogout({ isLoggedIn: false }));
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default createAdminApiClient;