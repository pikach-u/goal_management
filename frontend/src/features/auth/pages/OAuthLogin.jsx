import React from "react";

const OAuthLogin = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>OAuth2 Login Test</h1>

      {/* Google 로그인 */}
      <a href="http://localhost:8080/oauth2/authorization/google">
        <button style={{ padding: "10px 20px", margin: "10px" }}>
          Login with Google
        </button>
      </a>

      {/* GitHub 로그인 */}
      <a href="http://localhost:8080/oauth2/authorization/github">
        <button style={{ padding: "10px 20px", margin: "10px" }}>
          Login with GitHub
        </button>
      </a>
    </div>
  );
};

export default OAuthLogin;
