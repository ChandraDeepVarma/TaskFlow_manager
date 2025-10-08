// src/components/Signup.jsx
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Signup({ onSignupSuccess, handleSetShowSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  async function handleSignup(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password, role }
      );
      alert(response.data.message);
      onSignupSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
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
          <div className="auth-icon">✨</div>
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="auth-field">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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

          <div className="auth-field">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="auth-btn" type="submit">
            Signup
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span className="link" onClick={() => handleSetShowSignup()}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
