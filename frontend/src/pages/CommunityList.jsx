import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, TrendingUp, Clock, Heart, Home } from "lucide-react";

const CommunityList = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // latest, popular, trending

  // Mock data - 나중에 API에서 가져올 데이터
  const posts = [
    {
      id: 1,
      title: "오늘도 운동 완료!",
      content:
        "아침 6시에 일어나서 조깅 30분 완료! 날씨가 좋아서 기분이 너무 좋았어요.",
      author: "JohnDoe",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      date: "2024.10.24",
      views: 142,
      likes: 24,
      comments: 8,
      goalId: 1,
      goalTitle: "매일 운동하기",
    },
    {
      id: 2,
      title: "React Hooks 정리 완료",
      content:
        "useState, useEffect, useContext, useReducer 등 주요 Hooks를 정리했습니다.",
      author: "Alice",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      date: "2024.10.23",
      views: 256,
      likes: 45,
      comments: 12,
      goalId: 2,
      goalTitle: "React 마스터하기",
    },
    {
      id: 3,
      title: "아침 루틴 만들기 성공",
      content:
        "일주일 동안 매일 아침 6시에 일어나기 성공! 아침 시간을 활용하니 하루가 훨씬 알차게 느껴집니다.",
      author: "Bob",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      date: "2024.10.22",
      views: 189,
      likes: 32,
      comments: 15,
      goalId: 1,
      goalTitle: "매일 운동하기",
    },
    {
      id: 4,
      title: "독서 노트 - 데일 카네기",
      content:
        "인간관계론을 읽고 정리했습니다. 사람들과의 관계에서 정말 중요한 인사이트를 많이 얻었어요.",
      author: "Charlie",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
      date: "2024.10.21",
      views: 98,
      likes: 18,
      comments: 5,
      goalId: 3,
      goalTitle: "책 10권 읽기",
    },
    {
      id: 5,
      title: "코딩테스트 준비 1주차 회고",
      content:
        "알고리즘 문제를 매일 2개씩 풀기 시작했습니다. 처음엔 어려웠지만 점점 재미있어지네요.",
      author: "Emma",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      date: "2024.10.20",
      views: 324,
      likes: 56,
      comments: 20,
      goalId: 2,
      goalTitle: "React 마스터하기",
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes - a.likes;
    } else if (sortBy === "trending") {
      return b.views - a.views;
    }
    return 0; // latest는 이미 정렬되어 있다고 가정
  });

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
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      sortBy === "latest"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    최신순
                  </button>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      sortBy === "popular"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    인기순
                  </button>
                  <button
                    onClick={() => setSortBy("trending")}
                    className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                      sortBy === "trending"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    조회순
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/community/${post.id}`)}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {post.author}
                        </span>
                        <span className="text-sm text-gray-500">·</span>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      {post.goalTitle && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            🎯 {post.goalTitle}
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span>댓글 {post.comments}</span>
                        <span>조회 {post.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
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
