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
import axios from "axios";

export default function InfoUser({ onClose, chat, theme = "dark" }) {
  const [openSection, setOpenSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [chatDetail, setChatDetail] = useState(null);

  // Toggle mở/đóng từng section
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  // Hiện panel ngay lập tức, không animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Đóng panel ngay lập tức, không animation
  const handleClose = () => {
    onClose();
  };

  // Gọi MockAPI lấy thông tin chi tiết chat
  useEffect(() => {
    if (chat?.id) {
      axios
        .get(`https://6905d07aee3d0d14c133cc68.mockapi.io/chats/${chat.id}`)
        .then((res) => setChatDetail(res.data))
        .catch((err) => console.error("Lỗi lấy chi tiết chat:", err));
    }
  }, [chat]);

  // Dữ liệu hiển thị (ưu tiên dữ liệu từ API)
  const display = chatDetail || chat;

  return (
    <div className="info-user">
      <div
        className={`info-user-container ${theme} ${isVisible ? "visible" : ""}`}
      >
        <div className={`info-user-panel ${theme}`}>
          {/* HEADER */}
          <div className="info-header">
            <FaTimes className="close-btn" onClick={handleClose} />
            <img
              src={display?.avatar || "https://i.pravatar.cc/150?img=12"}
              alt="avatar"
              className="info-avatar"
            />
            <h3 className="info-name">{display?.name || "Người dùng"}</h3>
            <p className="status">Hoạt động {display?.time || "vừa xong"}</p>

            <div className="info-icons">
              <button className="icon" title="Trang cá nhân">
                <FaUser />
              </button>
              <button className="icon" title="Tắt thông báo">
                <FaBellSlash />
              </button>
              <button className="icon" title="Tìm kiếm trong đoạn chat">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="info-body">
            {[
              {
                title: "Thông tin về đoạn chat",
                content: display?.description || "Không có mô tả",
              },
              {
                title: "Tùy chỉnh đoạn chat",
                content: "Cài đặt màu nền, biểu tượng, biệt danh...",
              },
              {
                title: "File phương tiện & file",
                content: "Hiển thị danh sách ảnh, video, tệp được chia sẻ.",
              },
              {
                title: "Quyền riêng tư & hỗ trợ",
                content: "Cài đặt bảo mật, chặn người dùng hoặc báo cáo.",
              },
            ].map((section, idx) => (
              <div key={idx} className="info-section">
                <div
                  className="info-section-header"
                  onClick={() => toggleSection(idx)}
                >
                  <span>{section.title}</span>
                  {openSection === idx ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openSection === idx && (
                  <div className="info-content">{section.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
