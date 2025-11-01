import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MainChat from "../MainChat/MainChat";
import InfoUser from "../InfoUser/InfoUser";
import "./Index.css";
import { getChats, getMessages } from "../../Services/api";
import axios from "axios";

export default function ChatRoom() {
  const [theme, setTheme] = useState("dark");
  const [showInfo, setShowInfo] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [filter, setFilter] = useState("all");

  // 🔹 Lấy danh sách chat từ MockAPI và load chat đầu tiên
  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await getChats();
        const chatList = res.data;
        setChats(chatList);

        // 🔹 Nếu có danh sách chat và chưa có chat nào được chọn
        if (chatList.length > 0 && !selectedChat) {
          let firstChat = chatList[0];

          // 🔸 Nếu chat đầu tiên chưa đọc -> cập nhật thành đã đọc
          if (firstChat.unread) {
            try {
              await axios.put(
                `https://6905d07aee3d0d14c133cc68.mockapi.io/chats/${firstChat.id}`,
                { unread: false }
              );

              // Cập nhật local state để UI thay đổi ngay
              firstChat = { ...firstChat, unread: false };
              setChats((prevChats) =>
                prevChats.map((c) =>
                  c.id === firstChat.id ? { ...c, unread: false } : c
                )
              );
            } catch (updateErr) {
              console.error("Không thể cập nhật trạng thái đọc:", updateErr);
            }
          }

          // 🔹 Lấy danh sách tin nhắn cho chat đầu tiên
          const resMsg = await getMessages(firstChat.id);
          const messages = resMsg.data || [];
          setSelectedChat({ ...firstChat, messages });
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chat:", err);
      }
    }

    fetchChats();
  }, []);

  // 🔹 Chọn 1 chat → load messages
  const handleSelectChat = async (chat) => {
    try {
      // Nếu chat chưa đọc -> cập nhật thành đã đọc
      if (chat.unread) {
        try {
          await axios.put(
            `https://6905d07aee3d0d14c133cc68.mockapi.io/chats/${chat.id}`,
            { unread: false }
          );

          // Cập nhật local state để UI thay đổi ngay
          setChats((prevChats) =>
            prevChats.map((c) =>
              c.id === chat.id ? { ...c, unread: false } : c
            )
          );
        } catch (updateErr) {
          console.error("Không thể cập nhật trạng thái đọc:", updateErr);
        }
      }

      // 🔹 Lấy tin nhắn của chat
      const res = await getMessages(chat.id);
      const messages = res.data || [];

      const updatedChat = { ...chat, messages, unread: false };
      setSelectedChat(updatedChat);
      setShowInfo(false);
    } catch (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
    }
  };

  // 🔹 Lọc danh sách chat theo filter
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

      {showInfo && selectedChat && (
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
