import { FaEllipsisV } from "react-icons/fa";

export default function ChatBody({
  chat,
  showMenuId,
  setShowMenuId,
  setConfirmDelete,
  formatTime,
}) {
  return (
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
  );
}
