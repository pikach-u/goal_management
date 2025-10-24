import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import GoalDetail from "./pages/GoalDetail";
import GoalCreate from "./pages/GoalCreate";
import Profile from "./pages/Profile";
import CommunityList from "./pages/CommunityList";
import CommunityDetail from "./pages/CommunityDetail";
import CommunityWrite from "./pages/CommunityWrite";
import PrivateRoute from "./components/PrivateRoute";

/**
 * URL 경로에 따라 어떤 페이지를 보여줄지 결정 (라우터 설정)
 */
const App = () => {
  // 로그인 상태 확인
  const isAuthenticated = () => {
    return localStorage.getItem("accessToken") !== null;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 - 로그인 상태에 따라 분기 */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* 인증 - 로그인/회원가입 통합 페이지 */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* 대시보드 - 골 진척도 확인 (인증 필요) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 목표(Goals) 관리 (인증 필요) */}
        <Route
          path="/goals/new"
          element={
            <PrivateRoute>
              <GoalCreate />
            </PrivateRoute>
          }
        />
        <Route
          path="/goals/:id"
          element={
            <PrivateRoute>
              <GoalDetail />
            </PrivateRoute>
          }
        />

        {/* 프로필/마이페이지 (인증 필요) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* 커뮤니티/게시판 (인증 필요) */}
        <Route
          path="/community"
          element={
            <PrivateRoute>
              <CommunityList />
            </PrivateRoute>
          }
        />
        <Route
          path="/community/new"
          element={
            <PrivateRoute>
              <CommunityWrite />
            </PrivateRoute>
          }
        />
        <Route
          path="/community/:id"
          element={
            <PrivateRoute>
              <CommunityDetail />
            </PrivateRoute>
          }
        />

        {/* OAuth 리다이렉트 (필요시 추가) */}
        {/* <Route path="/oauth-redirect" element={<OAuthRedirectPage />} /> */}

        {/* 404 - 잘못된 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
