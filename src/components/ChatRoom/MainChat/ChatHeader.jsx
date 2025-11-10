import { FaPhone, FaVideo, FaInfoCircle } from "react-icons/fa";

export default function ChatHeader({ chat, onToggleInfo, timeAgo }) {
  const lastActive =
    chat.messages && chat.messages.length > 0
      ? (() => {
          const otherMsgs = chat.messages.filter((m) => m.from !== "me");
          if (otherMsgs.length === 0) return "chưa có hoạt động";
          const lastMsg = otherMsgs[otherMsgs.length - 1];
          return timeAgo(lastMsg.createdAt);
        })()
      : "chưa có hoạt động";

  return (
    <div className="chat-header">
      <div className="chat-user-info">
        <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
        <div>
          <h3>{chat.name}</h3>
          <p>Hoạt động {lastActive}</p>
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
  );
}
