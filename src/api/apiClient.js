import axios from "axios";
import store from "../redux/store";
import { loginSuccess, logout } from "../redux/userAuthSlice";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const accessTokenKey = "userAccessToken";
const refreshTokenKey = "userRefreshToken";

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(
  (req) => {
    const accessToken = localStorage.getItem(accessTokenKey);

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(refreshTokenKey);

        if (!refreshToken) throw new Error("Refresh token missing");

        const { data } = await axios.post(
          `${apiUrl}/user/token/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = data.message;

        store.dispatch(
          loginSuccess({
            accessToken,
            refreshToken: newRefreshToken,
            isLoggedIn: true,
          })
        );

        localStorage.setItem(accessTokenKey, accessToken);
        localStorage.setItem(refreshTokenKey, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);

      } catch (refreshError) {

        store.dispatch(logout({ isLoggedIn: false }));

        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      console.warn("User blocked. Logging out...");

      store.dispatch(logout({ isLoggedIn: false }));

      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(refreshTokenKey);
    }

    return Promise.reject(error);
  }
);

export default apiClient;