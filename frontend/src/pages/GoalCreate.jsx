import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Home } from "lucide-react";
import useGoalStore from "../features/goal/store/goalStore";
import { getLocalDateString } from "../utils/dateUtils";

const GoalCreate = () => {
  const navigate = useNavigate();
  const { createGoal, loading: storeLoading, error: storeError } = useGoalStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!formData.title.trim()) {
      setError("목표 제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      setError("목표 설명을 입력해주세요.");
      return;
    }
    if (!formData.startDate) {
      setError("시작일을 선택해주세요.");
      return;
    }
    if (!formData.endDate) {
      setError("종료일을 선택해주세요.");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("종료일은 시작일보다 이후여야 합니다.");
      return;
    }

    setLoading(true);

    try {
      // API 호출 (백엔드 필드명에 맞게 매핑)
      const goalData = {
        goalName: formData.title,
        goalContent: formData.content,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "진행중", // 기본 상태
      };

      const newGoal = await createGoal(goalData);

      // 성공 시 목표 상세 페이지로 이동
      navigate(`/goals/${newGoal.goalId}`);
    } catch (err) {
      setError(err.response?.data?.message || "목표 생성에 실패했습니다.");
      console.error("생성 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      formData.title.trim() ||
      formData.content.trim() ||
      formData.startDate ||
      formData.endDate
    ) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // 오늘 날짜 (최소 시작일) - 로컬 시간대 기준
  const today = getLocalDateString();

  // 디버깅: 오늘 날짜 확인
  console.log("Today's date (GoalCreate):", today);
  console.log("Current Date object:", new Date());
  console.log("Current Date components:", {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
    hours: new Date().getHours(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation Buttons */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-blue-600 flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            대시보드
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">새 목표 만들기</h1>
            <p className="text-gray-600">달성하고 싶은 목표를 설정해보세요</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="예: 매일 운동하기, React 마스터하기"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시작일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  종료일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                목표 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="이 목표를 통해 달성하고 싶은 것을 구체적으로 작성해주세요.&#10;&#10;예시:&#10;- 건강한 삶을 위해 매일 30분씩 운동하기&#10;- 주 5회 이상 달성을 목표로 합니다&#10;- 꾸준함이 중요한 목표입니다"
                rows="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                목표를 구체적으로 작성하면 달성하기 더 쉬워집니다
              </p>
            </div>

            {/* Tips Box */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                💡 효과적인 목표 설정 팁
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 구체적이고 측정 가능한 목표를 설정하세요</li>
                <li>• 현실적이면서도 도전적인 목표가 좋습니다</li>
                <li>• 기간을 명확하게 정하면 동기부여에 도움이 됩니다</li>
                <li>• 작은 목표부터 시작해서 성취감을 느껴보세요</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                {loading ? "생성 중..." : "목표 생성"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                취소
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">목표 관리 가이드</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 목표는 언제든지 수정하거나 삭제할 수 있습니다</li>
            <li>• 진행 상황을 꾸준히 기록하면 달성률이 높아집니다</li>
            <li>• 커뮤니티에 경험을 공유하며 서로 응원해보세요</li>
            <li>• 목표 달성 시 자동으로 배지와 포인트를 받을 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoalCreate;
