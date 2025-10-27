import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, TrendingUp, Clock, Heart, Home } from "lucide-react";
import usePostStore from "../features/community/store/postStore";

const CommunityList = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const { posts, pagination, loading, error, fetchPosts } = usePostStore();

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    try {
      await fetchPosts({
        page: currentPage,
        size: 10,
      });
    } catch (err) {
      console.error("게시글 목록 조회 실패:", err);
    }
  };

  const handleSearch = async () => {
    try {
      await fetchPosts({
        keyword: searchKeyword,
        page: 0,
        size: 10,
      });
      setCurrentPage(0);
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 좋아요 토글
  const handleLike = async (e, postNo) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    e.preventDefault(); // 기본 동작 방지
    try {
      await usePostStore.getState().toggleLike(postNo);
    } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 날짜 포맷 (LocalDateTime을 사용자 친화적으로)
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
            <p className="text-gray-600">목표 달성 경험을 공유해보세요</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              대시보드
            </button>
            <button
              onClick={() => navigate("/community/new")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              글쓰기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요 (Enter로 검색)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  검색
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">게시글을 불러오는 중...</p>
              </div>
            )}

            {/* Posts List */}
            {!loading && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.postNo}
                    onClick={() => navigate(`/community/${post.postNo}`)}
                    className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {post.userNickname}
                          </span>
                          <span className="text-sm text-gray-500">·</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(post.createDate)}
                          </span>
                        </div>
                        {post.goalTitle && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              🎯 {post.goalTitle}
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {post.postTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <button
                            onClick={(e) => handleLike(e, post.postNo)}
                            className={`flex items-center gap-1 hover:scale-110 transition-all duration-200 ${
                              post.isLikedByCurrentUser
                                ? "text-red-500 font-semibold"
                                : "hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                post.isLikedByCurrentUser ? "fill-current" : ""
                              }`}
                            />
                            {post.likeCount}
                          </button>
                          <span>댓글 {post.commentCount}</span>
                          <span>조회 {post.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500">게시글이 없습니다.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {["운동", "독서", "공부", "개발", "루틴", "영어"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                커뮤니티 가이드
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 목표 달성 경험을 공유해주세요</li>
                <li>• 서로 응원하고 격려해주세요</li>
                <li>• 긍정적인 피드백을 남겨주세요</li>
                <li>• 스팸이나 광고는 자제해주세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityList;
