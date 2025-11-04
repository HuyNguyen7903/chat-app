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

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

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
          <input type="text" placeholder="Tìm kiếm" />
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
          {chats.map((chat) => (
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
          ))}
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
