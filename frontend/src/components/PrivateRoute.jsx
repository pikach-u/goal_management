import { Navigate } from "react-router-dom";

/**
 * 인증된 사용자만 접근 가능한 라우트
 * 로그인하지 않은 경우 /auth로 리다이렉트
 */
const PrivateRoute = ({ children }) => {
  // localStorage에서 토큰 확인
  const token = localStorage.getItem("accessToken");

  // 토큰이 없으면 로그인 페이지로
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // 토큰이 있으면 요청한 페이지 렌더링
  return children;
};

export default PrivateRoute;
