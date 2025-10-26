import api from "./api";
import StorageService from "./storage";

export const authService = {
  login: async (userData) => {
    const response = await api.post("/api/auth/login", userData);
    const { access_token, user } = response.data;

    StorageService.setAccessToken(access_token);
    StorageService.setUser(user);

    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    const { access_token, user } = response.data;

    StorageService.setAccessToken(access_token);
    StorageService.setUser(user);

    return response.data;
  },

  logout: () => {
    StorageService.clear();
  },

  getCurrentUser: () => {
    return StorageService.getUser();
  },

  isAuthenticated: () => {
    return !!StorageService.getAccessToken();
  },
};
