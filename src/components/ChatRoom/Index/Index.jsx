import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MainChat from "../MainChat/MainChat";
import InfoUser from "../InfoUser/InfoUser";
import "./Index.css";

export default function ChatRoom() {
  const [theme, setTheme] = useState("dark");
  const [showInfo, setShowInfo] = useState(false);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Trần Hữu Đăng",
      message: "NG",
      time: "29 phút",
      avatar: "https://i.pravatar.cc/40?img=6",
      unread: false,
      type: "private",
      messages: [
        { from: "them", text: "KILL" },
        { from: "me", text: "ALL" },
        { from: "them", text: "NG" },
      ],
    },
    {
      id: 2,
      name: "Huy Nguyễn",
      message: "Hi cc",
      time: "6 ngày",
      avatar: "https://i.pravatar.cc/40?img=5",
      unread: true,
      type: "private",
      messages: [
        { from: "me", text: "Hello Huy!" },
        { from: "them", text: "Hi cc" },
      ],
    },
    {
      id: 3,
      name: "Nhóm 1",
      message: "test 1",
      time: "1 giờ",
      avatar: "https://i.pravatar.cc/40?img=8",
      unread: true,
      type: "group",
      messages: [
        { from: "them", text: "ádhaskjdh" },
        { from: "me", text: "test" },
        { from: "them", text: "test 1" },
      ],
    },
    {
      id: 4,
      name: "Nhóm 2",
      message: "ádasd",
      time: "10 phút",
      avatar: "https://i.pravatar.cc/40?img=9",
      unread: false,
      type: "group",
      messages: [
        { from: "them", text: "hj" },
        { from: "me", text: "ádasd" },
      ],
    },
    {
      id: 5,
      name: "Mai Hương",
      message: "Cvvvcv",
      time: "2 ngày",
      avatar: "https://i.pravatar.cc/40?img=3",
      unread: true,
      type: "private",
      messages: [
        { from: "them", text: "vbvbv" },
        { from: "me", text: "Ocvvcvcv" },
      ],
    },
    {
      id: 6,
      name: "Nhóm 3",
      message: "iuiuiu",
      time: "3 giờ",
      avatar: "https://i.pravatar.cc/40?img=10",
      unread: false,
      type: "group",
      messages: [
        { from: "them", text: "ôiio" },
        { from: "me", text: "iuiui" },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [filter, setFilter] = useState("all");

  const handleSelectChat = (chat) => {
    const updated = chats.map((c) =>
      c.id === chat.id ? { ...c, unread: false } : c
    );
    setChats(updated);
    setSelectedChat(chat);
    setShowInfo(false);
  };

  const filteredChats = chats.filter((chat) => {
    if (filter === "unread") return chat.unread;
    if (filter === "group") return chat.type === "group";
    return true;
  });

  return (
    <div className={`chat-room ${theme}`}>
      <Sidebar
        chats={filteredChats}
        onSelectChat={handleSelectChat}
        selectedChat={selectedChat}
        theme={theme}
        setTheme={setTheme}
        filter={filter}
        setFilter={setFilter}
      />

      <MainChat
        chat={selectedChat}
        theme={theme}
        onToggleInfo={() => setShowInfo(!showInfo)}
      />

      {showInfo && (
        <div className="info-user">
          <InfoUser
            onClose={() => setShowInfo(false)}
            chat={selectedChat}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
}
