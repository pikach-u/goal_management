import { create } from "zustand";
import postService from "../service/post";

const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    size: 10,
  },
  loading: false,
  error: null,

  // 게시글 목록 조회
  fetchPosts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await postService.getAllPosts(params);
      set({
        posts: data.content || [],
        pagination: {
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 0,
          size: data.size || 10,
        },
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "게시글 목록 조회에 실패했습니다.",
      });
      throw err;
    }
  },

  // 내 게시글 목록 조회
  fetchMyPosts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const data = await postService.getMyPosts(params);
      set({
        posts: data.content || [],
        pagination: {
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 0,
          size: data.size || 10,
        },
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "내 게시글 조회에 실패했습니다.",
      });
      throw err;
    }
  },

  // 게시글 상세 조회
  fetchPost: async (postNo) => {
    set({ loading: true, error: null });
    try {
      const post = await postService.getPost(postNo);
      set({ currentPost: post, loading: false });
      return post;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "게시글 조회에 실패했습니다.",
      });
      throw err;
    }
  },

  // 게시글 작성
  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const newPost = await postService.createPost(postData);
      set((state) => ({
        posts: [newPost, ...state.posts],
        loading: false,
      }));
      return newPost;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "게시글 작성에 실패했습니다.",
      });
      throw err;
    }
  },

  // 게시글 수정
  updatePost: async (postNo, postData) => {
    set({ loading: true, error: null });
    try {
      const updatedPost = await postService.updatePost(postNo, postData);
      set((state) => ({
        posts: state.posts.map((p) =>
          p.postNo === postNo ? updatedPost : p
        ),
        currentPost:
          state.currentPost?.postNo === postNo
            ? updatedPost
            : state.currentPost,
        loading: false,
      }));
      return updatedPost;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "게시글 수정에 실패했습니다.",
      });
      throw err;
    }
  },

  // 게시글 삭제
  deletePost: async (postNo) => {
    set({ loading: true, error: null });
    try {
      await postService.deletePost(postNo);
      set((state) => ({
        posts: state.posts.filter((p) => p.postNo !== postNo),
        currentPost:
          state.currentPost?.postNo === postNo ? null : state.currentPost,
        loading: false,
      }));
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "게시글 삭제에 실패했습니다.",
      });
      throw err;
    }
  },

  // 게시글 좋아요 토글
  toggleLike: async (postNo) => {
    try {
      // postNo를 숫자로 변환
      const postNoNumber = Number(postNo);

      const result = await postService.toggleLike(postNoNumber);

      // currentPost와 posts 목록을 동시에 업데이트
      set((state) => {
        const updates = {};

        // 현재 게시글 상세 페이지에 있다면 업데이트
        if (state.currentPost?.postNo === postNoNumber) {
          updates.currentPost = {
            ...state.currentPost,
            likeCount: result.likeCount,
            isLikedByCurrentUser: result.isLiked,
          };
        }

        // 목록에도 반영 (likeCount와 isLikedByCurrentUser 모두 업데이트)
        updates.posts = state.posts.map((p) =>
          p.postNo === postNoNumber
            ? { ...p, likeCount: result.likeCount, isLikedByCurrentUser: result.isLiked }
            : p
        );

        return updates;
      });

      return result;
    } catch (err) {
      throw err;
    }
  },

  // 에러 초기화
  clearError: () => set({ error: null }),

  // currentPost 초기화
  clearCurrentPost: () => set({ currentPost: null }),
}));

export default usePostStore;
