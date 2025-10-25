import React, { useState } from "react";
import "./AuthForm.css";
import { FaCheck, FaTimes, FaUser, FaLock } from "react-icons/fa";

const SignupForm = ({ onSwitch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage(
        <span className="auth-message error">
          <FaTimes className="auth-icon-message" /> Passwords do not match!
        </span>
      );
      return;
    }

    const newUser = { username, password };
    localStorage.setItem("mockUser", JSON.stringify(newUser));

    setMessage(
      <span className="auth-message success">
        <FaCheck className="auth-icon-message" /> Account created for {username}
        !
      </span>
    );

    setUsername("");
    setPassword("");
    setConfirm("");

    setTimeout(() => {
      onSwitch();
    }, 1500);
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="auth-title">Register</h1>

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

        <div className="auth-input-box">
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <FaLock className="auth-icon" />
        </div>

        <button type="submit" className="auth-button">
          Register
        </button>

        {message && <div>{message}</div>}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button onClick={onSwitch} className="auth-link-btn">
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
