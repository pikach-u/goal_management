import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2, Trash2, Save, X, ArrowLeft, CheckCircle } from "lucide-react";

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - 나중에 API에서 가져올 데이터
  const [goal, setGoal] = useState({
    id: id,
    title: "매일 운동하기",
    period: "2025.10 - 2025.12",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    progress: 75,
    completed: 18,
    total: 92,
    description:
      "건강한 삶을 위해 매일 30분씩 운동하기. 주 5회 이상 달성을 목표로 합니다. 꾸준함이 가장 중요하며, 포기하지 않고 지속하는 것이 목표입니다.",
    status: "IN_PROGRESS",
  });

  // 달성 기록 - 날짜별로 완료 여부 저장 (YYYY-MM-DD 형식)
  const [achievements, setAchievements] = useState({
    "2025-10-01": true,
    "2025-10-02": true,
    "2025-10-03": true,
    "2025-10-05": true,
    "2025-10-06": true,
    "2025-10-08": true,
    "2025-10-09": true,
    "2025-10-10": true,
    "2025-10-12": true,
    "2025-10-13": true,
    "2025-10-15": true,
    "2025-10-16": true,
    "2025-10-17": true,
    "2025-10-19": true,
    "2025-10-20": true,
    "2025-10-21": true,
    "2025-10-22": true,
    "2025-10-23": true,
    // 오늘 (2025-10-24)은 아직 미완료 - 완료 가능 상태
  });

  // 오늘 날짜 (YYYY-MM-DD 형식)
  const today = new Date().toISOString().split("T")[0];

  // 목표 기간의 모든 날짜 생성
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }
    return dates;
  };

  const allDates = getDatesInRange(goal.startDate, goal.endDate);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: API 호출로 목표 업데이트
    console.log("목표 업데이트:", goal);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: 원래 데이터로 복원
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // TODO: API 호출로 목표 삭제
      console.log("목표 삭제:", id);
      navigate("/dashboard");
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
  const handleTodayAchievement = () => {
    if (achievements[today]) {
      alert("오늘은 이미 달성했습니다!");
      return;
    }

    // TODO: API 호출로 달성 기록 저장
    setAchievements({
      ...achievements,
      [today]: true,
    });

    // 완료 일수 업데이트
    const completedCount = Object.keys(achievements).filter(
      (date) => achievements[date]
    ).length + 1;

    setGoal({
      ...goal,
      completed: completedCount,
      progress: Math.round((completedCount / goal.total) * 100),
    });

    alert("오늘의 목표를 달성했습니다! 🎉");
  };

  // 오늘 달성 가능 여부 확인
  const canAchieveToday = () => {
    const todayDate = new Date(today);
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    // 목표 기간 내이고, 아직 달성하지 않았으면 가능
    return todayDate >= startDate && todayDate <= endDate && !achievements[today];
  };

  // 날짜의 상태 확인 (completed, today, future)
  const getDateStatus = (date) => {
    const dateObj = new Date(date);
    const todayObj = new Date(today);

    if (achievements[date]) {
      return "completed"; // 완료됨
    } else if (date === today) {
      return "today"; // 오늘 (완료 가능)
    } else if (dateObj > todayObj) {
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
          onClick={() => navigate(-1)}
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
