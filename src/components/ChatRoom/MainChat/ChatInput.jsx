import {
  FaRegSmile,
  FaPaperclip,
  FaFileImage,
  FaPaperPlane,
} from "react-icons/fa";

export default function ChatInput({ newMsg, setNewMsg, handleSend }) {
  return (
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
  );
}
