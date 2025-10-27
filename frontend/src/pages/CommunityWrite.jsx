import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Home } from "lucide-react";
import usePostStore from "../features/community/store/postStore";
import useGoalStore from "../features/goal/store/goalStore";

const CommunityWrite = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    postTitle: "",
    postContent: "",
    goalId: "",
  });
  const [error, setError] = useState("");

  const { createPost, loading: postLoading } = usePostStore();
  const { goals, fetchGoals, loading: goalLoading } = useGoalStore();

  // 컴포넌트 마운트 시 사용자의 목표 목록 조회
  useEffect(() => {
    const loadGoals = async () => {
      try {
        await fetchGoals();
      } catch (err) {
        console.error("목표 목록 조회 실패:", err);
      }
    };
    loadGoals();
  }, []);

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
    if (!formData.postTitle.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!formData.postContent.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    try {
      // API 호출
      const postData = {
        postTitle: formData.postTitle,
        postContent: formData.postContent,
        goalId: formData.goalId ? Number(formData.goalId) : null,
      };

      const newPost = await createPost(postData);

      alert("게시글이 작성되었습니다.");
      navigate(`/community/${newPost.postNo}`);
    } catch (err) {
      setError(err.response?.data?.message || "게시글 작성에 실패했습니다.");
      console.error("작성 에러:", err);
    }
  };

  const handleCancel = () => {
    if (
      formData.postTitle.trim() ||
      formData.postContent.trim()
    ) {
      if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">새 글 작성</h1>
            <p className="text-gray-600">목표 달성 경험을 공유해보세요</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Goal Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관련 목표 <span className="text-gray-500">(선택)</span>
              </label>
              <select
                name="goalId"
                value={formData.goalId}
                onChange={handleChange}
                disabled={goalLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">목표를 선택하세요 (선택사항)</option>
                {goals.map((goal) => (
                  <option key={goal.goalId} value={goal.goalId}>
                    {goal.goalName}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                이 글이 어떤 목표와 관련이 있는지 선택하면 다른 사람들이 더 쉽게 찾을 수 있어요
              </p>
            </div>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                name="postTitle"
                value={formData.postTitle}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                name="postContent"
                value={formData.postContent}
                onChange={handleChange}
                placeholder="내용을 입력하세요&#10;&#10;예시:&#10;- 오늘의 목표 달성 과정&#10;- 느낀 점이나 배운 점&#10;- 다른 분들께 도움이 될 만한 팁"
                rows="15"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                최소 10자 이상 작성해주세요
              </p>
            </div>

            {/* Writing Tips */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                💡 글쓰기 팁
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 구체적인 경험과 상황을 공유하면 더 좋아요</li>
                <li>• 긍정적이고 응원하는 분위기로 작성해주세요</li>
                <li>• 다른 분들에게 도움이 될 수 있는 팁을 포함해보세요</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={postLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                {postLoading ? "작성 중..." : "작성 완료"}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            커뮤니티 가이드
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 서로 존중하고 배려하는 태도로 소통해주세요</li>
            <li>• 욕설, 비방, 광고성 글은 삭제될 수 있습니다</li>
            <li>• 개인정보가 포함되지 않도록 주의해주세요</li>
            <li>• 저작권을 침해하는 내용은 작성하지 말아주세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityWrite;
