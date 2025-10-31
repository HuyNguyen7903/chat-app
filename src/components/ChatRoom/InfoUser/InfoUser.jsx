import React, { useState, useEffect } from "react";
import "./InfoUser.css";
import {
  FaUser,
  FaBellSlash,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";

export default function InfoUser({ onClose, chat, theme = "dark" }) {
  const [openSection, setOpenSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 150);
  };

  return (
    <div className="info-user">
      <div
        className={`info-user-container ${theme} ${
          isVisible ? "visible" : ""
        } ${isClosing ? "closing" : ""}`}
      >
        <div className={`info-user-panel ${theme}`}>
          {/* HEADER */}
          <div className="info-header">
            <FaTimes className="close-btn" onClick={handleClose} />
            <img
              src={chat?.avatar || "https://i.pravatar.cc/150?img=12"}
              alt="avatar"
              className="info-avatar"
            />
            <h3 className="info-name">{chat?.name || "Người dùng"}</h3>
            <p className="status">Hoạt động {chat?.time || "vừa xong"}</p>

            <div className="info-icons">
              <button className="icon">
                <FaUser />
              </button>
              <button className="icon">
                <FaBellSlash />
              </button>
              <button className="icon">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="info-body">
            {[
              "Thông tin về đoạn chat",
              "Tùy chỉnh đoạn chat",
              "File phương tiện & file",
              "Quyền riêng tư & hỗ trợ",
            ].map((title, idx) => (
              <div key={idx} className="info-section">
                <div
                  className="info-section-header"
                  onClick={() => toggleSection(idx)}
                >
                  <span>{title}</span>
                  {openSection === idx ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openSection === idx && (
                  <div className="info-content">Nội dung của {title}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
