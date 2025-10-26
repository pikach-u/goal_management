import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../features/auth/store/authStore";
import { useEffect } from "react";

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      navigate("/auth", { state: { error: "OAuth 로그인 실패" } });
      return;
    }

    if (token && refreshToken) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = {
          id: payload.id,
          email: payload.email,
          username: payload.username,
          bio: payload.bio || null,
          profileImageUrl: payload.profileImageUrl || null,
        };

        localStorage.setItem("user", JSON.stringify(user));

        setAuth({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

        navigate("/dashboard");
      } catch (err) {
        navigate("/login");
      }
    } else {
      navigate("/auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // OAuth Callback 페이지 로드 될 때 한 번만 실행하기 위해 의존성 배열 비움, ESLint 경고 무시

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-sky-500 to-cyan-400">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg font-medium">Logging you in...</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
