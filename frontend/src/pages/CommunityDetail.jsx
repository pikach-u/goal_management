import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Save, X, Heart, Eye } from "lucide-react";
import usePostStore from "../features/community/store/postStore";

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    postTitle: "",
    postContent: "",
  });

  const {
    currentPost,
    fetchPost,
    updatePost,
    deletePost,
    toggleLike,
    loading,
    clearCurrentPost,
  } = usePostStore();

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    const loadPost = async () => {
      try {
        await fetchPost(id);
      } catch (err) {
        console.error("게시글 조회 실패:", err);
        alert("게시글을 불러오는데 실패했습니다.");
        navigate("/community");
      }
    };
    loadPost();

    return () => {
      clearCurrentPost();
    };
  }, [id, fetchPost, navigate, clearCurrentPost]);

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  const handleEdit = () => {
    setEditFormData({
      postTitle: currentPost.postTitle,
      postContent: currentPost.postContent,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updatePost(id, editFormData);
      setIsEditing(false);
      alert("게시글이 수정되었습니다.");
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deletePost(id);
        alert("게시글이 삭제되었습니다.");
        navigate("/community");
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleLike = async () => {
    try {
      await toggleLike(Number(id));
    } catch (err) {
      console.error("좋아요 실패:", err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  if (loading || !currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/community")}
          className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </button>

        {/* Post Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {currentPost.userNickname}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(currentPost.createDate)}
              </p>
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

          {/* Goal Tag */}
          {currentPost.goalTitle && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                🎯 {currentPost.goalTitle}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            {isEditing ? (
              <input
                type="text"
                name="postTitle"
                value={editFormData.postTitle}
                onChange={handleInputChange}
                className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                {currentPost.postTitle}
              </h1>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              조회 {currentPost.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              좋아요 {currentPost.likeCount}
            </span>
          </div>

          {/* Content */}
          <div>
            {isEditing ? (
              <textarea
                name="postContent"
                value={editFormData.postContent}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="10"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentPost.postContent}
              </p>
            )}
          </div>

          {/* Like Button */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLike}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto ${
                  currentPost.isLikedByCurrentUser === true
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:scale-105"
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    currentPost.isLikedByCurrentUser === true
                      ? "fill-current animate-pulse"
                      : ""
                  }`}
                />
                좋아요
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
