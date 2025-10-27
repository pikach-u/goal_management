import api from "../../../services/api";

const postService = {
  // 게시글 목록 조회 (검색, 페이징)
  getAllPosts: async (params = {}) => {
    const { keyword, page = 0, size = 10 } = params;
    const queryParams = new URLSearchParams({
      page,
      size,
      ...(keyword && { keyword }),
    });
    const response = await api.get(`/api/posts?${queryParams}`);
    return response.data;
  },

  // 내 게시글 목록 조회
  getMyPosts: async (params = {}) => {
    const { page = 0, size = 10 } = params;
    const queryParams = new URLSearchParams({
      page,
      size,
    });
    const response = await api.get(`/api/posts/my?${queryParams}`);
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (postNo) => {
    const response = await api.get(`/api/posts/${postNo}`);
    return response.data;
  },

  // 게시글 작성
  createPost: async (postData) => {
    const response = await api.post("/api/posts", postData);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (postNo, postData) => {
    const response = await api.patch(`/api/posts/${postNo}`, postData);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (postNo) => {
    const response = await api.delete(`/api/posts/${postNo}`);
    return response.data;
  },

  // 게시글 좋아요 토글
  toggleLike: async (postNo) => {
    const response = await api.post(`/api/posts/${postNo}/like`);
    return response.data;
  },
};

export default postService;
