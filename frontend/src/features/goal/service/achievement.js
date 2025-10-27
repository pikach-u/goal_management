import api from "../../../services/api";

const achievementService = {
  // 특정 목표의 모든 달성 기록 조회
  getAchievements: async (goalId) => {
    const response = await api.get(`/api/goals/${goalId}/achievements`);
    return response.data;
  },

  // 달성 기록 추가
  createAchievement: async (goalId, achievedDate) => {
    const response = await api.post(`/api/goals/${goalId}/achievements`, {
      achievedDate,
    });
    return response.data;
  },

  // 달성 기록 삭제
  deleteAchievement: async (goalId, achievedDate) => {
    await api.delete(`/api/goals/${goalId}/achievements/${achievedDate}`);
  },
};

export default achievementService;
