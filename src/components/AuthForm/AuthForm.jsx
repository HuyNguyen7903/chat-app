import React, { useState, useEffect, useRef } from "react";
import "./AuthForm.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../../redux/authSlice";
import { FaGoogle, FaFacebookF, FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import PhoneSignup from "./PhoneSignup";
import logo from "../assets/bglogin.jpg";
const ZALO_APP_ID = "693069574775036123";
const REDIRECT_URI = "http://localhost:3000/auth/zalo/callback";

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  const [showPhoneSignup, setShowPhoneSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const signInEmailRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const loginZalo = () => {
    window.location.href = `https://oauth.zalo.me/v4/permission?app_id=${ZALO_APP_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=achat`;
  };
  // Nếu có token thì vào trang /chat
  useEffect(() => {
    if (token) {
      navigate("/chat");
    }
  }, [token, navigate]);

  // Focus vào input email khi chuyển sang form Sign In
  useEffect(() => {
    if (!isActive && signInEmailRef.current) {
      signInEmailRef.current.focus();
    }
  }, [isActive]);

  // Nếu có remember token -> tự login lại
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      navigate("/chat");
    }
  }, [token, navigate]);

  // --- Xử lý đăng ký email ---
  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }
    if (form.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch(signupUser(form));
    alert("Account created! Please log in.");
    setIsActive(false);
  };

  // --- Xử lý đăng nhập ---
  const handleLogin = (e) => {
    e.preventDefault();
    const identifier = form.email.trim();
    const isPhone = /^\d{9,15}$/.test(identifier);

    if (!identifier || !form.password) {
      alert("Please enter email/phone and password!");
      return;
    }

    const loginData = isPhone
      ? { phone: identifier, password: form.password }
      : { email: identifier, password: form.password };

    dispatch(loginUser(loginData))
      .unwrap()
      .then(() => {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
        navigate("/chat");
      })
      .catch(() => {
        alert("Invalid email/phone or password!");
      });
  };

  return (
    <div className="auth-wrapper">
      {/* ===== Logo + App name ===== */}
      <div className="top-logo">
        <img src={logo} alt="AChat Logo" className="logo-img" />
        <h2 className="app-title">AChat</h2>
      </div>

      {/* ===== Main Container ===== */}
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {showPhoneSignup ? (
          <PhoneSignup
            onBackToSignup={() => setShowPhoneSignup(false)}
            onGoToLogin={() => {
              setShowPhoneSignup(false);
              setIsActive(false);
            }}
          />
        ) : (
          <>
            {/* --- Sign Up Form --- */}
            <div className="form-container sign-up">
              <form onSubmit={handleSignup}>
                <h1>Create Account</h1>
                <div className="social-icons">
                  <a href="#" className="icon google">
                    <FaGoogle />
                  </a>
                  <a href="#" className="icon facebook">
                    <FaFacebookF />
                  </a>
                  <a
                    href="#"
                    className="icon phone"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPhoneSignup(true);
                    }}
                  >
                    <FaPhoneAlt />
                  </a>
                  <a className="icon zalo" onClick={loginZalo}>
                    <SiZalo />
                  </a>
                </div>
                <span>or use your email for registration</span>

                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={!isActive}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={!isActive}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  disabled={!isActive}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isActive}
                />

                <button type="submit" disabled={!isActive}>
                  Sign Up
                </button>
                <div className="mobile-switch">
                  <p>Already have an account?</p>
                  <button type="button" onClick={() => setIsActive(false)}>
                    Sign In
                  </button>
                </div>
              </form>
            </div>

            {/* --- Sign In Form --- */}
            <div className="form-container sign-in">
              <form onSubmit={handleLogin}>
                <h1>Sign In</h1>
                <div className="social-icons">
                  <a href="#" className="icon google">
                    <FaGoogle />
                  </a>
                  <a href="#" className="icon facebook">
                    <FaFacebookF />
                  </a>
                  <a className="icon zalo" onClick={loginZalo}>
                    <SiZalo />
                  </a>
                </div>
                <span>or use your email password</span>

                <input
                  ref={signInEmailRef}
                  type="text"
                  placeholder="Email or Phone Number"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isActive}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  disabled={isActive}
                />

                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isActive}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>

                <a href="#">Forgot Your Password?</a>
                <button type="submit" disabled={isActive}>
                  Sign In
                </button>

                <div className="mobile-switch">
                  <p>Don’t have an account?</p>
                  <button type="button" onClick={() => setIsActive(true)}>
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* --- Toggle Panel --- */}
        {!showPhoneSignup && (
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
        )}
      </div>
    </div>
  );
}
