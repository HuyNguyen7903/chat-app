import React, { useState } from "react";
import "./AuthForm.css";
import { FaUser, FaLock, FaCheck, FaTimes } from "react-icons/fa";

const LoginForm = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("mockUser"));

    if (
      storedUser &&
      username === storedUser.username &&
      password === storedUser.password
    ) {
      setMessage(
        <span className="auth-message success">
          <FaCheck className="auth-icon-message" /> Login successful!
        </span>
      );
    } else {
      setMessage(
        <span className="auth-message error">
          <FaTimes className="auth-icon-message" /> Invalid username or password
        </span>
      );
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="auth-title">Login</h1>

        <div className="auth-input-box">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="auth-icon" />
        </div>

        <div className="auth-input-box">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="auth-icon" />
        </div>

        <div className="auth-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>

        {message && <div>{message}</div>}

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button onClick={onSwitch} className="auth-link-btn">
              Register
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
