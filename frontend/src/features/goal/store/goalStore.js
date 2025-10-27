import { create } from "zustand";
import goalService from "../service/goal";

const useGoalStore = create((set, get) => ({
  goals: [],
  currentGoal: null,
  loading: false,
  error: null,

  // 모든 목표 조회
  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const goals = await goalService.getAllGoals();
      set({ goals, loading: false });
      return goals;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "목표 조회에 실패했습니다.",
      });
      throw err;
    }
  },

  // 특정 목표 조회
  fetchGoal: async (goalId) => {
    set({ loading: true, error: null });
    try {
      const goal = await goalService.getGoal(goalId);
      set({ currentGoal: goal, loading: false });
      return goal;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "목표 조회에 실패했습니다.",
      });
      throw err;
    }
  },

  // 목표 생성
  createGoal: async (goalData) => {
    set({ loading: true, error: null });
    try {
      const newGoal = await goalService.createGoal(goalData);
      set((state) => ({
        goals: [...state.goals, newGoal],
        loading: false,
      }));
      return newGoal;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "목표 생성에 실패했습니다.",
      });
      throw err;
    }
  },

  // 목표 수정
  updateGoal: async (goalId, goalData) => {
    set({ loading: true, error: null });
    try {
      const updatedGoal = await goalService.updateGoal(goalId, goalData);
      set((state) => ({
        goals: state.goals.map((g) =>
          g.goalId === goalId ? updatedGoal : g
        ),
        currentGoal:
          state.currentGoal?.goalId === goalId
            ? updatedGoal
            : state.currentGoal,
        loading: false,
      }));
      return updatedGoal;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "목표 수정에 실패했습니다.",
      });
      throw err;
    }
  },

  // 목표 삭제
  deleteGoal: async (goalId) => {
    set({ loading: true, error: null });
    try {
      await goalService.deleteGoal(goalId);
      set((state) => ({
        goals: state.goals.filter((g) => g.goalId !== goalId),
        currentGoal:
          state.currentGoal?.goalId === goalId ? null : state.currentGoal,
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "목표 삭제에 실패했습니다.",
      });
      throw err;
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null }),

  // currentGoal 초기화
  clearCurrentGoal: () => set({ currentGoal: null }),
}));

export default useGoalStore;
