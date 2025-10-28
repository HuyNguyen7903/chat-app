import React from "react";
import "./MainChat.css";
import {
  FaPhone,
  FaInfoCircle,
  FaVideo,
  FaMicrophone,
  FaRegSmile,
  FaPaperclip,
  FaPaperPlane,
  FaFileImage,
} from "react-icons/fa";

export default function MainChat({ chat, theme }) {
  if (!chat)
    return <div className={`main-chat ${theme}`}>Chưa chọn đoạn chat</div>;

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
          <button className="chat-btn">
            <FaInfoCircle />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {chat.messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.from === "me" ? "right" : "left"}`}
          >
            {msg.from !== "me" && (
              <img src={chat.avatar} alt="avatar" className="msg-avatar" />
            )}
            <div className="msg-text">{msg.text}</div>
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
        <input type="text" placeholder="Aa" />
        <button className="send-btn">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
