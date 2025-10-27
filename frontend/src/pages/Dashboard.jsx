import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Award, LogOut, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useGoalStore from "../features/goal/store/goalStore";
import usePostStore from "../features/community/store/postStore";
import { formatPeriod } from "../utils/dateUtils";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const navigate = useNavigate();

  // Zustand store에서 goals 가져오기
  const { goals, fetchGoals, loading: goalsLoading } = useGoalStore();

  // Zustand store에서 posts 가져오기
  const { posts, fetchMyPosts, loading: postsLoading } = usePostStore();

  const [userData, setUserData] = useState({
    username: "",
    totalGoals: 0,
    completedGoals: 0,
    points: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // 사용자 정보 조회
        const res = await api.get("/api/users/me");

        // 목표 데이터 조회
        await fetchGoals();

        // 내 게시글 조회
        await fetchMyPosts({ page: 0, size: 5 });

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
    loadData();
  }, [fetchGoals, fetchMyPosts]);

  // 실제 goals 데이터를 기반으로 통계 계산
  useEffect(() => {
    if (goals && goals.length > 0) {
      const totalGoals = goals.length;
      const completedGoals = goals.filter(g => g.status === "완료" || g.status === "COMPLETED").length;

      setUserData(prev => ({
        ...prev,
        totalGoals,
        completedGoals,
      }));
    }
  }, [goals]);

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
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

  // 전체 진행률 계산 (목표가 있을 때만)
  const calculateProgress = (goal) => {
    if (!goal.startDate || !goal.endDate) return 0;

    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const today = new Date();

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));

    if (elapsedDays <= 0) return 0;
    if (elapsedDays >= totalDays) return 100;

    return Math.round((elapsedDays / totalDays) * 100);
  };

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, goal) => acc + calculateProgress(goal), 0) / goals.length)
    : 0;

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

                  {goalsLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      목표를 불러오는 중...
                    </div>
                  ) : goals.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">아직 목표가 없습니다.</p>
                      <button
                        onClick={() => navigate("/goals/new")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        첫 목표 만들기
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => {
                        const progress = calculateProgress(goal);
                        const totalDays = Math.ceil(
                          (new Date(goal.endDate) - new Date(goal.startDate)) / (1000 * 60 * 60 * 24)
                        );
                        const elapsedDays = Math.max(
                          0,
                          Math.min(
                            totalDays,
                            Math.ceil((new Date() - new Date(goal.startDate)) / (1000 * 60 * 60 * 24))
                          )
                        );

                        return (
                          <div
                            key={goal.goalId}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {goal.goalName}
                                </h3>
                                <span className="text-xs text-gray-500 mt-1 inline-block">
                                  {goal.status}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatPeriod(goal.startDate, goal.endDate)}
                              </span>
                            </div>
                            <div className="mb-2">
                              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-600 h-full rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                {elapsedDays}/{totalDays}일 경과
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-blue-600 font-medium">
                                  {progress}%
                                </span>
                                <button
                                  onClick={() => navigate(`/goals/${goal.goalId}`)}
                                  className="text-gray-600 hover:text-gray-900 hover:underline text-sm font-medium transition-all"
                                >
                                  자세히 보기 →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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

                {postsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    게시글을 불러오는 중...
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">작성한 글이 없습니다.</p>
                    <button
                      onClick={() => navigate("/community/new")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      첫 글 작성하기
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post.postNo}
                        onClick={() => navigate(`/community/${post.postNo}`)}
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
                          {post.postTitle}
                        </h3>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{formatDate(post.createDate)}</span>
                          <div className="flex items-center gap-4">
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
                            <span>💬 {post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
