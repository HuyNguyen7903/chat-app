import React, { useState, useRef } from "react";
import "./PhoneSignup.css";
import { API } from "../../services/authAPI";

export default function PhoneSignup({ onBackToSignup, onGoToLogin }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpRefs = useRef([]);

  // Nhập số điện thoại
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone.match(/^\d{10,15}$/)) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      //Lấy toàn bộ danh sách users
      const res = await API.get("/users");
      const existing = res.data.find((u) => u.phone === phone);

      if (existing) {
        alert("Phone number already registered! Please log in.");
        onGoToLogin();
        return;
      }

      alert(`OTP sent to ${phone}`);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error checking phone: " + err.message);
    }
  };

  // Nhập mã OTP
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < 5) otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      alert("Please enter complete OTP");
      return;
    }
    alert("OTP verified successfully!");
    setStep(3);
  };

  //Tạo mật khẩu
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const newUser = {
        phone,
        password,
        token: `token_${Date.now()}`,
      };

      await API.post("/users", newUser);
      alert("Account created successfully!");
      onGoToLogin();
    } catch (err) {
      alert("Error creating account: " + err.message);
    }
  };

  return (
    <div className="phone-signup-wrapper">
      {step === 1 && (
        <form onSubmit={handlePhoneSubmit}>
          <h2>Sign Up with Phone</h2>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit">Next</button>
          <button type="button" className="action-btn" onClick={onBackToSignup}>
            Back
          </button>

          <div className="phone-signup-footer">
            Already have an account?
            <button type="button" className="link-btn" onClick={onGoToLogin}>
              Sign in
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpSubmit}>
          <h2>Enter OTP</h2>
          <div className="otp-container">
            {otp.map((val, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={val}
                ref={(el) => (otpRefs.current[index] = el)}
                onChange={(e) => handleOtpChange(e, index)}
              />
            ))}
          </div>
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordSubmit}>
          <h2>Set Password</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
}
