import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2, Trash2, Save, X, ArrowLeft, CheckCircle } from "lucide-react";
import useGoalStore from "../features/goal/store/goalStore";
import achievementService from "../features/goal/service/achievement";
import { getLocalDateString, getDatesInRange } from "../utils/dateUtils";

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Zustand store에서 goal 관련 함수 가져오기
  const {
    currentGoal,
    fetchGoal,
    updateGoal,
    deleteGoal,
    loading,
    error,
  } = useGoalStore();

  const [goal, setGoal] = useState(null);
  const [originalGoal, setOriginalGoal] = useState(null); // 수정 취소용

  // 달성 기록 - 날짜별로 완료 여부 저장 (YYYY-MM-DD 형식)
  const [achievements, setAchievements] = useState({});
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  // 오늘 날짜 (YYYY-MM-DD 형식) - useMemo로 메모이제이션하여 안정적인 값 보장
  const today = useMemo(() => {
    return getLocalDateString();
  }, []);

  // 컴포넌트 마운트 시 목표 데이터 조회
  useEffect(() => {
    const loadGoal = async () => {
      try {
        await fetchGoal(id);
      } catch (err) {
        console.error("목표 조회 실패:", err);
        alert("목표를 불러오는데 실패했습니다.");
        navigate("/dashboard");
      }
    };
    loadGoal();
  }, [id, fetchGoal, navigate]);

  // currentGoal이 로드되면 goal state에 설정 및 achievements 로드
  useEffect(() => {
    if (currentGoal) {
      const formattedGoal = {
        id: currentGoal.goalId,
        title: currentGoal.goalName,
        description: currentGoal.goalContent,
        startDate: currentGoal.startDate,
        endDate: currentGoal.endDate,
        status: currentGoal.status,
        // 진행률 계산
        progress: 0,
        completed: 0,
        total: 0,
      };

      // 기간 계산
      const start = new Date(currentGoal.startDate);
      const end = new Date(currentGoal.endDate);
      const today = new Date();
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.max(
        0,
        Math.min(
          totalDays,
          Math.ceil((today - start) / (1000 * 60 * 60 * 24))
        )
      );

      formattedGoal.total = totalDays;
      formattedGoal.completed = elapsedDays;
      formattedGoal.progress = totalDays > 0 ? Math.round((elapsedDays / totalDays) * 100) : 0;

      // 날짜 포맷 (YYYY.MM - YYYY.MM)
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
      };
      formattedGoal.period = `${formatDate(currentGoal.startDate)} - ${formatDate(currentGoal.endDate)}`;

      setGoal(formattedGoal);
      setOriginalGoal(formattedGoal); // 원본 저장

      // 달성 기록 로드
      loadAchievements(currentGoal.goalId);
    }
  }, [currentGoal]);

  // 달성 기록 로드 함수
  const loadAchievements = async (goalId) => {
    setAchievementsLoading(true);
    try {
      const achievementsList = await achievementService.getAchievements(goalId);

      // 배열을 객체로 변환 { "YYYY-MM-DD": true }
      const achievementsMap = {};
      achievementsList.forEach((achievement) => {
        achievementsMap[achievement.achievedDate] = true;
      });

      setAchievements(achievementsMap);

      // 달성 기록 개수로 completed 업데이트
      setGoal(prev => ({
        ...prev,
        completed: achievementsList.length,
        progress: prev.total > 0 ? Math.round((achievementsList.length / prev.total) * 100) : 0,
      }));
    } catch (err) {
      console.error("달성 기록 로드 실패:", err);
    } finally {
      setAchievementsLoading(false);
    }
  };

  // 로딩 중일 때
  if (loading || !goal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">목표를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const allDates = getDatesInRange(goal.startDate, goal.endDate);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // API 호출로 목표 업데이트 (백엔드 필드명에 맞게 매핑)
      const goalData = {
        goalName: goal.title,
        goalContent: goal.description,
        startDate: goal.startDate,
        endDate: goal.endDate,
        status: goal.status,
      };

      await updateGoal(id, goalData);
      setOriginalGoal(goal); // 업데이트 성공 시 원본도 갱신
      setIsEditing(false);
      alert("목표가 수정되었습니다.");
    } catch (err) {
      console.error("목표 수정 실패:", err);
      alert("목표 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setGoal(originalGoal); // 원래 데이터로 복원
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteGoal(id);
        alert("목표가 삭제되었습니다.");
        navigate("/dashboard");
      } catch (err) {
        console.error("목표 삭제 실패:", err);
        alert("목표 삭제에 실패했습니다.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoal({
      ...goal,
      [name]: value,
    });
  };

  // 오늘 목표 달성 처리
  const handleTodayAchievement = async () => {
    if (achievements[today]) {
      alert("오늘은 이미 달성했습니다!");
      return;
    }

    try {
      // API 호출로 달성 기록 저장
      await achievementService.createAchievement(id, today);

      // 로컬 상태 업데이트
      const newAchievements = {
        ...achievements,
        [today]: true,
      };
      setAchievements(newAchievements);

      // 완료 일수 업데이트
      const completedCount = Object.keys(newAchievements).length;

      setGoal({
        ...goal,
        completed: completedCount,
        progress: Math.round((completedCount / goal.total) * 100),
      });

      alert("오늘의 목표를 달성했습니다! 🎉");
    } catch (err) {
      console.error("달성 기록 저장 실패:", err);
      alert(err.response?.data?.message || "달성 기록 저장에 실패했습니다.");
    }
  };

  // 오늘 달성 가능 여부 확인 (문자열 비교로 타임존 문제 방지)
  const canAchieveToday = () => {
    // 목표 기간 내이고, 아직 달성하지 않았으면 가능
    return today >= goal.startDate && today <= goal.endDate && !achievements[today];
  };

  // 날짜의 상태 확인 (completed, today, future) - 문자열 비교
  const getDateStatus = (date) => {
    if (achievements[date]) {
      return "completed"; // 완료됨
    } else if (date === today) {
      return "today"; // 오늘 (완료 가능)
    } else if (date > today) {
      return "future"; // 미래
    } else {
      return "missed"; // 놓침
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={goal.title}
                  onChange={handleInputChange}
                  className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{goal.title}</h1>
              )}
              <p className="text-gray-500 mt-2">{goal.period}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Today's Achievement Button */}
          {canAchieveToday() && !isEditing && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    오늘의 목표
                  </h3>
                  <p className="text-sm text-gray-600">
                    오늘 하루도 목표를 향해 나아가세요!
                  </p>
                </div>
                <button
                  onClick={handleTodayAchievement}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  오늘 달성 완료
                </button>
              </div>
            </div>
          )}

          {achievements[today] && !isEditing && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    오늘의 목표 달성 완료!
                  </h3>
                  <p className="text-sm text-green-700">
                    잘하셨습니다! 내일도 화이팅! 💪
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">진행률</span>
              <span>
                {goal.completed}/{goal.total}일 완료
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-blue-600 font-medium mt-2">
              {goal.progress}% 완료
            </p>
          </div>

          {/* Description Section */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">목표 설명</h2>
            {isEditing ? (
              <textarea
                name="description"
                value={goal.description}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="6"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{goal.description}</p>
            )}
          </div>

          {/* Achievement Record */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">달성 기록</h2>
            <div className="mb-4 flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>완료</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                <span>오늘 (완료 가능)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span>미완료</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {allDates.map((date) => {
                const status = getDateStatus(date);
                const dateObj = new Date(date);
                const day = dateObj.getDate();

                let bgColor = "bg-gray-100 text-gray-400";
                let hoverEffect = "";

                if (status === "completed") {
                  bgColor = "bg-blue-600 text-white";
                  hoverEffect = "hover:bg-blue-700";
                } else if (status === "today") {
                  bgColor = "bg-blue-200 text-blue-900";
                  hoverEffect = "hover:bg-blue-300 cursor-pointer";
                } else if (status === "missed") {
                  bgColor = "bg-gray-100 text-gray-400";
                } else {
                  // future
                  bgColor = "bg-gray-50 text-gray-300";
                }

                return (
                  <div
                    key={date}
                    onClick={() => {
                      if (status === "today" && !isEditing) {
                        handleTodayAchievement();
                      }
                    }}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition ${bgColor} ${hoverEffect}`}
                    title={date}
                  >
                    <div className="text-lg">{day}</div>
                    {status === "completed" && (
                      <CheckCircle className="w-3 h-3 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">통계</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">완료 일수</p>
                <p className="text-2xl font-bold text-blue-600">{goal.completed}일</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">남은 일수</p>
                <p className="text-2xl font-bold text-green-600">
                  {goal.total - goal.completed}일
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">달성률</p>
                <p className="text-2xl font-bold text-purple-600">{goal.progress}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;
