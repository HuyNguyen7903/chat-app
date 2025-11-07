import React, { useState } from "react";
import "./AuthForm.css";
import { FaGoogle, FaFacebookF, FaApple, FaPhoneAlt } from "react-icons/fa";
import logo from "../Assets/bglogin.jpg"; // đặt ảnh bạn vừa tải lên ở đây

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="auth-wrapper">
      {/* ===== Logo + App name ===== */}
      <div className="top-logo">
        <img src={logo} alt="AChat Logo" className="logo-img" />
        <h2 className="app-title">AChat</h2>
      </div>

      {/* ===== Main Container ===== */}
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* --- Sign Up Form --- */}
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon google">
                <FaGoogle />
              </a>
              <a href="#" className="icon facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="icon phone">
                <FaPhoneAlt />
              </a>
              <a href="#" className="icon apple">
                <FaApple />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="button">Sign Up</button>
            <div className="mobile-switch">
              <p>Already have an account?</p>
              <button onClick={() => setIsActive(false)}>Sign In</button>
            </div>
          </form>
        </div>

        {/* --- Sign In Form --- */}
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon google">
                <FaGoogle />
              </a>
              <a href="#" className="icon facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="icon phone">
                <FaPhoneAlt />
              </a>
              <a href="#" className="icon apple">
                <FaApple />
              </a>
            </div>
            <span>or use your email password</span>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <a href="#">Forgot Your Password?</a>
            <button type="button">Sign In</button>
            <div className="mobile-switch">
              <p>Don’t have an account?</p>
              <button onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </form>
        </div>

        {/* --- Toggle Panel --- */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Login to chat with your friends instantly</p>
              <button className="hidden" onClick={() => setIsActive(false)}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register now to join the realtime chat community</p>
              <button className="hidden" onClick={() => setIsActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
