import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaPen,
  FaEllipsisH,
  FaSearch,
  FaSun,
  FaMoon,
  FaUser,
} from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Thêm state tìm kiếm

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
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
              <FaPen />
            </button>
            <button className="icon-btn" onClick={() => setShowInfo(true)}>
              <FaUser />
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
            onChange={(e) => setSearchTerm(e.target.value)} // 🟢 Cập nhật theo input
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
                <span className="chat-time">{chat.time}</span>
              </li>
            ))
          ) : (
            <li className="no-chat">Không tìm thấy đoạn chat nào</li> // 🟢 Thông báo nếu không có kết quả
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
