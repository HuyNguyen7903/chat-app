import React, { useState, useEffect } from "react";
import {
  FaBan,
  FaThumbsDown,
  FaUser,
  FaBellSlash,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import "./InfoUser.css";
import { getChatDetail } from "../../../services/api";

export default function InfoUser({ onClose, chat, theme = "dark" }) {
  const [openSection, setOpenSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [chatDetail, setChatDetail] = useState(null);

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    async function fetchChatDetail() {
      if (chat?.id) {
        try {
          const res = await getChatDetail(chat.id);
          setChatDetail(res.data);
        } catch (err) {
          console.error("Lỗi lấy chi tiết chat:", err);
        }
      }
    }

    fetchChatDetail();
  }, [chat]);

  // Hàm hiển thị thời gian
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const time =
      timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
    const diff = Date.now() - new Date(time).getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return `${weeks} tuần trước`;
  };

  // Dữ liệu hiển thị
  const display = chatDetail
    ? { ...chatDetail, messages: chat?.messages || [] }
    : chat;

  const lastActive = (() => {
    if (display?.messages && display.messages.length > 0) {
      const otherMsgs = display.messages.filter((m) => m.from !== "me");
      if (otherMsgs.length > 0) {
        const lastMsg = otherMsgs[otherMsgs.length - 1];
        return timeAgo(lastMsg.createdAt);
      }
    }

    if (display?.lastMessageTime) {
      return timeAgo(display.lastMessageTime);
    }

    return "chưa có hoạt động";
  })();

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
            <p className="status">Hoạt động {lastActive}</p>

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

          {/* FOOTER */}
          <div className="info-footer">
            <button className="danger-btn">
              <FaBan /> Block {display?.name || "người này"}
            </button>
            <button className="danger-btn">
              <FaThumbsDown /> Report {display?.name || "người này"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
