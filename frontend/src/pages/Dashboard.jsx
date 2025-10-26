import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Award, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../features/auth/services/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const navigate = useNavigate();

  // Mock data - 나중에 API에서 가져올 데이터
  const [userData, setUserData] = useState({
    username: "",
    totalGoals: 0,
    completedGoals: 0,
    points: 0,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await api.get("/api/users/me");
        setUserData({
          username: res.data.username,
          totalGoals: res.data.totalGoals || 0,
          completedGoals: res.data.completedGoals || 0,
          points: res.data.totalPoints || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    loadUserData();
  }, []);

  const goals = [
    {
      id: 1,
      title: "매일 운동하기",
      period: "2024.10 - 2024.12",
      progress: 75,
      completed: 45,
      total: 60,
    },
    {
      id: 2,
      title: "React 마스터하기",
      period: "2024.09 - 2024.11",
      progress: 60,
      completed: 18,
      total: 30,
    },
    {
      id: 3,
      title: "책 10권 읽기",
      period: "2024.10 - 2024.12",
      progress: 40,
      completed: 4,
      total: 10,
    },
  ];

  const posts = [
    {
      id: 1,
      title: "오늘도 운동 완료!",
      date: "2024.10.24",
      likes: 24,
      comments: 8,
      goalId: 1,
      goalTitle: "매일 운동하기",
    },
    {
      id: 2,
      title: "React Hooks 정리 완료",
      date: "2024.10.23",
      likes: 18,
      comments: 5,
      goalId: 2,
      goalTitle: "React 마스터하기",
    },
    {
      id: 3,
      title: "아침 루틴 만들기 성공",
      date: "2024.10.22",
      likes: 32,
      comments: 12,
      goalId: 1,
      goalTitle: "매일 운동하기",
    },
  ];

  const badges = [
    { id: 1, name: "이달의 성실왕", icon: "👑", date: "2024.10" },
    { id: 2, name: "연속 7일 달성", icon: "🔥", date: "2024.10" },
    { id: 3, name: "첫 목표 달성", icon: "🎯", date: "2024.09" },
    { id: 4, name: "100일 연속", icon: "💯", date: "2024.10" },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "goal",
      message: "매일 운동하기 목표 1일 달성",
      time: "2시간 전",
    },
    {
      id: 2,
      type: "badge",
      message: "연속 7일 달성 배지 획득",
      time: "1일 전",
    },
    {
      id: 3,
      type: "goal",
      message: "React 마스터하기 목표 업데이트",
      time: "2일 전",
    },
  ];

  const overallProgress = Math.round(
    goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length
  );

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              안녕하세요, {userData.username}님! 👋
            </h1>
            <p className="text-gray-600">
              오늘도 목표를 향해 한 걸음 나아가세요
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/goals/new")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Target className="w-4 h-4" />새 목표
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">전체 목표</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userData.totalGoals}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">완료한 목표</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userData.completedGoals}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">획득 포인트</p>
                <p className="text-3xl font-bold text-gray-900">
                  {userData.points}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex gap-0 border-b">
            <button
              onClick={() => setActiveTab("goals")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "goals"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              목표
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "posts"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              작성글
            </button>
            <button
              onClick={() => setActiveTab("badges")}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === "badges"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              획득한 뱃지
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Goals Tab */}
            {activeTab === "goals" && (
              <div className="animate-fade-in">
                {/* Overall Progress */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    전체 진행률
                  </h2>
                  <div className="bg-gray-200 rounded-full h-6 overflow-hidden mb-2">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {overallProgress}% 완료
                  </p>
                </div>

                {/* Goals List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    진행 중인 목표
                  </h2>

                  <div className="space-y-4">
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {goal.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {goal.period}
                          </span>
                        </div>
                        <div className="mb-2">
                          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-600 h-full rounded-full transition-all"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">
                            {goal.completed}/{goal.total}일 완료
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-blue-600 font-medium">
                              {goal.progress}%
                            </span>
                            <button
                              onClick={() => navigate(`/goals/${goal.id}`)}
                              className="text-gray-600 hover:text-gray-900 hover:underline text-sm font-medium transition-all"
                            >
                              자세히 보기 →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="animate-fade-in bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    내 작성글
                  </h2>
                  <button
                    onClick={() => navigate("/community")}
                    className="text-gray-600 hover:text-gray-900 hover:underline text-sm font-medium transition-all"
                  >
                    커뮤니티 둘러보기 →
                  </button>
                </div>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/community/${post.id}`)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                      {post.goalTitle && (
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            🎯 {post.goalTitle}
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{post.date}</span>
                        <div className="flex items-center gap-4">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === "badges" && (
              <div className="animate-fade-in bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  획득한 뱃지
                </h2>
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                최근 활동
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.type === "badge"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {activity.type === "badge" ? (
                        <Award className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Target className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
