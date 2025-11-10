import React, { useState } from "react";
import "./MainChat.css";
import { sendMessage, deleteMessage } from "../../../services/api";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../../redux/chatSlice";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import DeleteModal from "./DeleteModal";

export default function MainChat({ chat, theme, onToggleInfo }) {
  const [newMsg, setNewMsg] = useState("");
  const [showMenuId, setShowMenuId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const dispatch = useDispatch();

  if (!chat) return <div className={`main-chat ${theme}`}></div>;

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

    const updatedMessages = [...chat.messages, newMessage].sort(
      (a, b) => a.createdAt - b.createdAt
    );
    const updatedChat = { ...chat, messages: updatedMessages };
    dispatch(setSelectedChat(updatedChat));
    setNewMsg("");

    const textarea = document.querySelector(".chat-input textarea");
    if (textarea) textarea.style.height = "auto";

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
      <ChatHeader chat={chat} onToggleInfo={onToggleInfo} timeAgo={timeAgo} />
      <ChatBody
        chat={chat}
        showMenuId={showMenuId}
        setShowMenuId={setShowMenuId}
        setConfirmDelete={setConfirmDelete}
        formatTime={formatTime}
      />
      <ChatInput
        newMsg={newMsg}
        setNewMsg={setNewMsg}
        handleSend={handleSend}
      />
      {confirmDelete && (
        <DeleteModal
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  );
}
