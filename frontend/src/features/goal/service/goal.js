import api from "../../../services/api";

const goalService = {
  // 목표 생성
  createGoal: async (goalData) => {
    const response = await api.post("/api/goals", goalData);
    return response.data;
  },

  // 모든 목표 조회
  getAllGoals: async () => {
    const response = await api.get("/api/goals");
    return response.data;
  },

  // 특정 목표 조회
  getGoal: async (goalId) => {
    const response = await api.get(`/api/goals/${goalId}`);
    return response.data;
  },

  // 목표 수정
  updateGoal: async (goalId, goalData) => {
    const response = await api.put(`/api/goals/${goalId}`, goalData);
    return response.data;
  },

  // 목표 삭제
  deleteGoal: async (goalId) => {
    await api.delete(`/api/goals/${goalId}`);
  },
};

export default goalService;
