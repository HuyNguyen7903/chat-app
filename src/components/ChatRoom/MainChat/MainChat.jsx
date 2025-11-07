import React, { useState } from "react";
import {
  FaPhone,
  FaInfoCircle,
  FaVideo,
  FaRegSmile,
  FaPaperclip,
  FaPaperPlane,
  FaFileImage,
  FaEllipsisV,
} from "react-icons/fa";
import "./MainChat.css";
import { sendMessage, deleteMessage } from "../../../services/api";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../../redux/chatSlice";

export default function MainChat({ chat, theme, onToggleInfo }) {
  const [newMsg, setNewMsg] = useState("");
  const [showMenuId, setShowMenuId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const dispatch = useDispatch();

  if (!chat) return <div className={`main-chat ${theme}`}></div>;

  // ✅ Hàm hiển thị dạng "vừa xong", "3 phút trước", "2 ngày trước", ...
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

  // ✅ Hàm format cho từng tin nhắn (giữ nguyên logic cũ)
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

  const handleSend = async () => {
    const messageText = newMsg.trim();
    if (!messageText) return;

    const now = Math.floor(Date.now() / 1000);
    const newMessage = {
      chatId: chat.id,
      from: "me",
      text: messageText,
      createdAt: now,
    };

    // ✅ Sắp xếp trước khi dispatch
    const updatedMessages = [...chat.messages, newMessage].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    const updatedChat = { ...chat, messages: updatedMessages };
    dispatch(setSelectedChat(updatedChat));
    setNewMsg("");

    // ✅ Reset chiều cao ô nhập khi gửi tin nhắn
    const textarea = document.querySelector(".chat-input textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }

    try {
      const res = await sendMessage(newMessage);
      if (res?.data?.id) {
        const chatWithId = {
          ...updatedChat,
          messages: updatedMessages.map((m) =>
            m === newMessage ? { ...m, id: res.data.id } : m
          ),
        };
        dispatch(setSelectedChat(chatWithId));
      }
    } catch (err) {
      console.error("Gửi tin nhắn thất bại:", err);
    }
  };

  const handleDelete = async (msgId) => {
    const updatedChat = {
      ...chat,
      messages: chat.messages.filter((m) => m.id !== msgId),
    };
    dispatch(setSelectedChat(updatedChat));
    setShowMenuId(null);
    setConfirmDelete(null);

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
            <p>
              Hoạt động{" "}
              {chat.messages && chat.messages.length > 0
                ? (() => {
                    const otherMsgs = chat.messages.filter(
                      (m) => m.from !== "me"
                    );
                    if (otherMsgs.length === 0) return "chưa có hoạt động";
                    const lastMsg = otherMsgs[otherMsgs.length - 1];
                    return timeAgo(lastMsg.createdAt);
                  })()
                : "chưa có hoạt động"}
            </p>
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
            key={msg.id || msg.createdAt}
            className={`message ${msg.from === "me" ? "right" : "left"}`}
          >
            {msg.from !== "me" && (
              <img src={chat.avatar} alt="avatar" className="msg-avatar" />
            )}

            <div className="msg-wrapper">
              <div className="msg-text">{msg.text}</div>
              <div className="msg-time-popup">{formatTime(msg.createdAt)}</div>

              <div
                className="msg-options"
                onClick={() =>
                  setShowMenuId((prev) => (prev === msg.id ? null : msg.id))
                }
              >
                <FaEllipsisV />
              </div>

              {showMenuId === msg.id && (
                <div className="msg-menu">
                  <button onClick={() => setConfirmDelete(msg.id)}>Xóa</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <button className="emoji-btn">
          <FaRegSmile />
        </button>

        <textarea
          placeholder="Aa"
          value={newMsg}
          rows={1}
          onChange={(e) => {
            setNewMsg(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="chat-tools-right">
          <button>
            <FaPaperclip />
          </button>
          <button>
            <FaFileImage />
          </button>
        </div>

        <button className="send-btn" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>

      {/* MODAL XÁC NHẬN XÓA */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Xóa tin nhắn?</h3>
            <p>Bạn có chắc chắn muốn xóa tin nhắn này không?</p>
            <div className="modal-buttons">
              <button
                className="btn-cancel"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
              <button
                className="btn-confirm"
                onClick={() => handleDelete(confirmDelete)}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
