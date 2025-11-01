import React, { useState } from "react";
import {
  FaPhone,
  FaInfoCircle,
  FaVideo,
  FaMicrophone,
  FaRegSmile,
  FaPaperclip,
  FaPaperPlane,
  FaFileImage,
  FaEllipsisV,
} from "react-icons/fa";
import "./MainChat.css";
import { sendMessage, deleteMessage } from "../../Services/api";

export default function MainChat({ chat, theme, onToggleInfo }) {
  const [newMsg, setNewMsg] = useState("");
  const [showMenuId, setShowMenuId] = useState(null);

  if (!chat) return null;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day}/${month}, ${time}`;
  };

  // Gửi tin nhắn
  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const now = Math.floor(Date.now() / 1000);
    const newMessage = {
      chatId: chat.id,
      from: "me",
      text: newMsg,
      createdAt: now,
    };

    try {
      const res = await sendMessage(newMessage);
      chat.messages.push({ ...newMessage, id: res.data.id });
      setNewMsg("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  // Xóa tin nhắn
  const handleDelete = async (msgId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tin nhắn này?");
    if (!confirmDelete) return;

    const updated = chat.messages.filter((m) => m.id !== msgId);
    chat.messages = updated;
    setShowMenuId(null);

    try {
      await deleteMessage(msgId);
    } catch (err) {
      console.error("Lỗi khi xóa tin nhắn:", err);
      alert("Không thể xóa tin nhắn trên server.");
    }
  };

  return (
    <div className={`main-chat ${theme}`}>
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-user-info">
          <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
          <div>
            <h3>{chat.name}</h3>
            <p>Hoạt động {chat.time} trước</p>
          </div>
        </div>

        <div className="chat-actions">
          <button className="chat-btn">
            <FaPhone />
          </button>
          <button className="chat-btn">
            <FaVideo />
          </button>
          <button className="chat-btn" onClick={onToggleInfo}>
            <FaInfoCircle />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {chat.messages?.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.from === "me" ? "right" : "left"}`}
          >
            {msg.from !== "me" && (
              <img src={chat.avatar} alt="avatar" className="msg-avatar" />
            )}

            <div className="msg-wrapper">
              <div className="msg-text">{msg.text}</div>

              {/* Thời gian hiển thị khi hover */}
              <div className="msg-time-popup">{formatTime(msg.createdAt)}</div>

              {/* Nút 3 chấm */}
              <div
                className="msg-options"
                onClick={() =>
                  setShowMenuId((prev) => (prev === msg.id ? null : msg.id))
                }
              >
                <FaEllipsisV />
              </div>

              {/* Menu xóa */}
              {showMenuId === msg.id && (
                <div className="msg-menu">
                  <button onClick={() => handleDelete(msg.id)}>Xóa</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <div className="chat-tools">
          <button>
            <FaMicrophone />
          </button>
          <button>
            <FaPaperclip />
          </button>
          <button>
            <FaRegSmile />
          </button>
          <button>
            <FaFileImage />
          </button>
        </div>

        <input
          type="text"
          placeholder="Aa"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="send-btn" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
