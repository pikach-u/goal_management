import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  X,
  Heart,
  MessageCircle,
  Eye,
} from "lucide-react";

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Mock data - 나중에 API에서 가져올 데이터
  const [post, setPost] = useState({
    id: id,
    title: "오늘도 운동 완료!",
    content:
      "아침 6시에 일어나서 조깅 30분 완료! 날씨가 좋아서 기분이 너무 좋았어요. 꾸준히 하니까 체력이 늘어나는 게 느껴집니다.\n\n요즘 매일 아침 운동을 하면서 건강해지는 걸 체감하고 있어요. 처음엔 힘들었는데 이제는 습관이 되어서 아침에 안 움직이면 몸이 이상한 느낌이 들 정도입니다.\n\n여러분도 함께 아침 운동 도전해보세요!",
    author: "JohnDoe",
    authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    date: "2024.10.24",
    views: 142,
    likes: 24,
    comments: [],
    goalId: 1,
    goalTitle: "매일 운동하기",
  });

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alice",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      content: "대단하세요! 저도 내일부터 시작해봐야겠어요",
      date: "2024.10.24 10:30",
    },
    {
      id: 2,
      author: "Bob",
      authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      content: "꾸준함이 정말 중요하죠. 응원합니다!",
      date: "2024.10.24 11:15",
    },
  ]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: API 호출로 게시글 업데이트
    console.log("게시글 업데이트:", post);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // TODO: 원래 데이터로 복원
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // TODO: API 호출로 게시글 삭제
      console.log("게시글 삭제:", id);
      navigate("/community");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setPost({
      ...post,
      likes: isLiked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "현재사용자",
        authorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        content: newComment,
        date: new Date().toLocaleString("ko-KR"),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

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
            <img
              src={post.authorImage}
              alt={post.author}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-500">{post.date}</p>
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
          {post.goalTitle && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
                🎯 {post.goalTitle}
              </span>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              조회 {post.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              좋아요 {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              댓글 {comments.length}
            </span>
          </div>

          {/* Content */}
          <div>
            {isEditing ? (
              <textarea
                name="content"
                value={post.content}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="10"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            )}
          </div>

          {/* Like Button */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLike}
                className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 mx-auto ${
                  isLiked
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "좋아요 취소" : "좋아요"}
              </button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            댓글 {comments.length}
          </h2>

          {/* Comment Input */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해주세요"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                댓글 작성
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-t pt-4">
                <div className="flex gap-4">
                  <img
                    src={comment.authorImage}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
