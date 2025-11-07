import React, { useState } from "react";
import "./Sidebar.css";
import { FaEllipsisH, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import InfoUser from "../InfoUser/InfoUser";

export default function Sidebar({
  chats,
  onSelectChat,
  selectedChat,
  theme,
  setTheme,
  filter,
  setFilter,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // ✅ Hàm format thời gian thành "x giờ trước", "x ngày trước", ...
  const timeAgo = (timestamp) => {
    // Nếu là giây thì nhân 1000
    const time =
      timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
    const diff = Date.now() - new Date(time).getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return `${weeks} tuần trước`;
  };

  // 🔍 Lọc danh sách chat theo từ khóa tìm kiếm
  const filteredChats = chats.filter((chat) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      chat.name.toLowerCase().includes(lowerTerm) ||
      chat.message.toLowerCase().includes(lowerTerm)
    );
  });

  return (
    <div className={`sidebar-container ${theme}`}>
      <div className="sidebar">
        {/* HEADER */}
        <div className="sidebar-header">
          <h2>Đoạn chat</h2>
          <div className="header-icons">
            <button className="icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>

            <button className="icon-btn">
              <FaEllipsisH />
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="sidebar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTER BUTTONS */}
        <div className="filter-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            Chưa đọc
          </button>
          <button
            className={filter === "group" ? "active" : ""}
            onClick={() => setFilter("group")}
          >
            Nhóm
          </button>
        </div>

        {/* CHAT LIST */}
        <ul className="chat-list">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <li
                key={chat.id}
                className={`chat-item 
                  ${chat.unread ? "unread" : ""} 
                  ${selectedChat?.id === chat.id ? "active" : ""}`}
                onClick={() => onSelectChat(chat)}
              >
                <img src={chat.avatar} alt={chat.name} className="avatar" />
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-message">{chat.message}</div>
                </div>
                {/* ✅ Hiển thị thời gian tương đối */}
                <span className="chat-time">
                  {chat.lastMessageTime
                    ? timeAgo(chat.lastMessageTime)
                    : "Chưa có tin nhắn"}
                </span>
              </li>
            ))
          ) : (
            <li className="no-chat">Không có đoạn chat nào chưa đọc</li>
          )}
        </ul>
      </div>

      {/* INFO USER */}
      {showInfo && (
        <div className="info-user-overlay">
          <InfoUser
            theme={theme}
            chat={selectedChat}
            onClose={() => setShowInfo(false)}
          />
        </div>
      )}
    </div>
  );
}
