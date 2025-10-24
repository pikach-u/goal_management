import React, { useState } from "react";
import { Mail, Calendar, Edit2, Save, X, Award, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [activeTab, setActiveTab] = useState("goals");

  // Mock data - 나중에 API에서 가져올 데이터
  const [userData, setUserData] = useState({
    userId: "uuid-12345",
    username: "JohnDoe",
    email: "john.doe@example.com",
    bio: "매일 성장하는 개발자입니다. 꾸준함이 제 무기에요!",
    joinDate: "2024.01.15",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    totalPoints: 1240,
    totalGoals: 12,
    completedGoals: 8,
  });

  const [editedBio, setEditedBio] = useState(userData.bio);

  const goals = [
    {
      id: 1,
      title: "매일 운동하기",
      period: "2024.10 - 2024.12",
      progress: 75,
      status: "IN_PROGRESS",
    },
    {
      id: 2,
      title: "React 마스터하기",
      period: "2024.09 - 2024.11",
      progress: 100,
      status: "COMPLETED",
    },
    {
      id: 3,
      title: "책 10권 읽기",
      period: "2024.10 - 2024.12",
      progress: 40,
      status: "IN_PROGRESS",
    },
  ];

  const badges = [
    { id: 1, name: "이달의 성실왕", icon: "👑", date: "2024.10" },
    { id: 2, name: "연속 7일 달성", icon: "🔥", date: "2024.10" },
    { id: 3, name: "첫 목표 달성", icon: "🎯", date: "2024.09" },
    { id: 4, name: "100일 연속", icon: "💯", date: "2024.10" },
  ];

  const posts = [
    {
      id: 1,
      title: "오늘도 운동 완료!",
      date: "2024.10.23",
      likes: 24,
    },
    {
      id: 2,
      title: "React Hooks 정리 완료",
      date: "2024.10.22",
      likes: 18,
    },
    {
      id: 3,
      title: "아침 루틴 만들기 성공",
      date: "2024.10.21",
      likes: 32,
    },
  ];

  const handleSaveBio = async () => {
    // TODO: API 호출로 bio 업데이트
    console.log("Bio 업데이트:", editedBio);
    setUserData({ ...userData, bio: editedBio });
    setIsEditingBio(false);
  };

  const handleCancelEdit = () => {
    setEditedBio(userData.bio);
    setIsEditingBio(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* User Bio Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-start gap-6">
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-100"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData.username}
                    </h2>
                    {!isEditingBio ? (
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveBio}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>가입일: {userData.joinDate}</span>
                    </div>
                  </div>
                  {isEditingBio ? (
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-700">{userData.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userData.totalGoals}
                </p>
                <p className="text-sm text-gray-600">전체 목표</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userData.completedGoals}
                </p>
                <p className="text-sm text-gray-600">완료한 목표</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{userData.totalPoints}</p>
                <p className="text-sm text-gray-600">포인트</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex gap-4 mb-6 border-b">
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`pb-3 px-4 font-medium transition ${
                    activeTab === "goals"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  목표
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`pb-3 px-4 font-medium transition ${
                    activeTab === "posts"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  게시글
                </button>
                <button
                  onClick={() => setActiveTab("badges")}
                  className={`pb-3 px-4 font-medium transition ${
                    activeTab === "badges"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  배지
                </button>
              </div>

              {/* Goals Tab */}
              {activeTab === "goals" && (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => navigate(`/goals/${goal.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            goal.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {goal.status === "COMPLETED" ? "완료" : "진행중"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{goal.period}</p>
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-blue-600 font-medium mt-1">
                        {goal.progress}%
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts Tab */}
              {activeTab === "posts" && (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/community/${post.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{post.date}</span>
                        <span>❤️ {post.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Badges Tab */}
              {activeTab === "badges" && (
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition"
                    >
                      <div className="text-5xl mb-3">{badge.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {badge.name}
                      </h4>
                      <p className="text-sm text-gray-500">{badge.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 액션</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/goals/new")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  새 목표 만들기
                </button>
                <button
                  onClick={() => navigate("/community/new")}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  게시글 작성
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  대시보드
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
