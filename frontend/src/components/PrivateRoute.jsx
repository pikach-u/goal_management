import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";

/**
 * 인증된 사용자만 접근 가능한 라우트
 * 로그인하지 않은 경우 /auth로 리다이렉트
 * Zustand Store 방식 - 로그인/로그아웃 상태가 자동으로 동기화, 일관된 상태 관리
 */
const PrivateRoute = ({ children }) => {
  // localStorage에서 토큰 확인 -> AuthStore의 isAuthenticated로 관리
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 토큰이 없으면 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 토큰이 있으면 요청한 페이지 렌더링
  return children;
};

export default PrivateRoute;
