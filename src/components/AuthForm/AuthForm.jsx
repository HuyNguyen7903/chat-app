import React, { useState, useEffect } from "react";
import "./AuthForm.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../../redux/authSlice";
import { FaGoogle, FaFacebookF, FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import logo from "../assets/bglogin.jpg";

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // Nếu có token thì vào trang /chat
  useEffect(() => {
    if (token) {
      navigate("/chat");
    }
  }, [token, navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all fields!");
      return;
    }
    dispatch(signupUser(form));
    alert("Account created! Please log in.");
    setIsActive(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      alert("Please enter email and password!");
      return;
    }

    dispatch(loginUser({ email: form.email, password: form.password }))
      .unwrap()
      .then(() => {
        navigate("/chat");
      })
      .catch(() => {
        alert("Invalid email or password!");
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
              <a href="#" className="icon phone">
                <FaPhoneAlt />
              </a>
              <a href="#" className="icon zalo">
                <SiZalo />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit">Sign Up</button>
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
              <a href="#" className="icon phone">
                <FaPhoneAlt />
              </a>
              <a href="#" className="icon zalo">
                <SiZalo />
              </a>
            </div>
            <span>or use your email password</span>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <a href="#">Forgot Your Password?</a>
            <button type="submit">Sign In</button>
            <div className="mobile-switch">
              <p>Don’t have an account?</p>
              <button type="button" onClick={() => setIsActive(true)}>
                Sign Up
              </button>
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
