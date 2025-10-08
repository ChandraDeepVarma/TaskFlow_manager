// src/components/Login.jsx
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Login({ onLoginSuccess, handleSetShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      onLoginSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="auth-root">
      {/* 🎥 Background Video */}
      <video autoPlay loop muted playsInline className="auth-bg">
        <source src="/src/assets/bg.mp4" type="video/mp4" />
      </video>

      {/* 🔳 Auth Card */}
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">👤</div>
          <h2>Welcome Back</h2>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <span className="link" onClick={() => handleSetShowSignup()}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
