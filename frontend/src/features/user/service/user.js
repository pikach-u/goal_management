import api from "../../../services/api";

const userService = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },
};

export default userService;
