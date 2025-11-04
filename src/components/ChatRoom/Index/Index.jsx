import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MainChat from "../MainChat/MainChat";
import InfoUser from "../InfoUser/InfoUser";
import "../../themes/theme-dark.css";
import "../../themes/theme-light.css";
import "./Index.css";
import { getChats, getMessages } from "../../../services/api";
import axios from "axios";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  setChats,
  setSelectedChat,
  updateChatUnread,
  setFilter,
} from "../../../redux/chatSlice";
import { setTheme } from "../../../redux/themeSlice";

export default function ChatRoom() {
  const dispatch = useDispatch();

  // Lấy state từ Redux store
  const chats = useSelector((state) => state.chat.chats);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const theme = useSelector((state) => state.theme.mode);
  const filter = useSelector((state) => state.chat.filter);

  // local state riêng (không đưa vào Redux)
  const [showInfo, setShowInfo] = useState(false);

  // Lấy danh sách chat từ MockAPI
  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await getChats();
        const chatList = res.data;
        dispatch(setChats(chatList));

        if (chatList.length > 0 && !selectedChat) {
          let firstChat = chatList[0];

          // Nếu chat đầu tiên chưa đọc -> cập nhật
          if (firstChat.unread) {
            try {
              await axios.put(
                `https://6905d07aee3d0d14c133cc68.mockapi.io/chats/${firstChat.id}`,
                { unread: false }
              );
              dispatch(
                updateChatUnread({ chatId: firstChat.id, unread: false })
              );
              firstChat = { ...firstChat, unread: false };
            } catch (err) {
              console.error("Lỗi cập nhật unread:", err);
            }
          }

          // Lấy tin nhắn chat đầu tiên
          const resMsg = await getMessages(firstChat.id);
          const messages = resMsg.data || [];
          dispatch(setSelectedChat({ ...firstChat, messages }));
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách chat:", err);
      }
    }

    fetchChats();
  }, [dispatch, selectedChat]);

  // Khi chọn 1 chat
  const handleSelectChat = async (chat) => {
    try {
      if (chat.unread) {
        try {
          await axios.put(
            `https://6905d07aee3d0d14c133cc68.mockapi.io/chats/${chat.id}`,
            { unread: false }
          );
          dispatch(updateChatUnread({ chatId: chat.id, unread: false }));
        } catch (updateErr) {
          console.error("Không thể cập nhật trạng thái đọc:", updateErr);
        }
      }

      const res = await getMessages(chat.id);
      const messages = res.data || [];
      dispatch(setSelectedChat({ ...chat, messages, unread: false }));
      setShowInfo(false);
    } catch (err) {
      console.error("Lỗi khi lấy tin nhắn:", err);
    }
  };

  // Lọc danh sách chat theo filter
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
        setTheme={(mode) => dispatch(setTheme(mode))}
        filter={filter}
        setFilter={(f) => dispatch(setFilter(f))}
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
