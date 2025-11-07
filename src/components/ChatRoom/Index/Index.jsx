import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MainChat from "../MainChat/MainChat";
import InfoUser from "../InfoUser/InfoUser";
import "../../themes/theme-dark.css";
import "../../themes/theme-light.css";
import "./Index.css";
import { getChats, getMessages } from "../../../services/api";
import axios from "axios";
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

        // Lấy tất cả messages
        const resMessages = await axios.get(
          "https://6905d07aee3d0d14c133cc68.mockapi.io/messages"
        );
        const allMessages = resMessages.data;

        // Ghép messages vào mỗi chat
        const mergedChats = chatList.map((chat) => {
          const chatMessages = allMessages.filter((msg) => {
            const msgChatId = msg.chatId.replace("chatId ", "");
            return msgChatId === chat.id;
          });

          if (chatMessages.length > 0) {
            const lastMsg = chatMessages.reduce((latest, msg) =>
              msg.createdAt > latest.createdAt ? msg : latest
            );
            return {
              ...chat,
              message: lastMsg.text,
              lastMessageTime: lastMsg.createdAt,
            };
          } else {
            return { ...chat, lastMessageTime: null };
          }
        });

        // Gửi dữ liệu vào Redux
        dispatch(setChats(mergedChats));

        // Nếu chưa có selectedChat thì chọn đoạn đầu tiên
        if (mergedChats.length > 0 && !selectedChat) {
          const firstChat = mergedChats[0];

          try {
            // Gọi API lấy messages riêng cho chắc chắn
            const resMsgs = await getMessages(firstChat.id);
            let chatMessages = resMsgs.data || [];

            // Sắp xếp theo thời gian
            chatMessages = chatMessages.sort(
              (a, b) => a.createdAt - b.createdAt
            );

            // Nếu đoạn đầu tiên chưa đọc → cập nhật thành đã đọc
            if (firstChat.unread) {
              await axios.put(
                `https://6905d07aee3d0d14c133cc68.mockapi.io/chats/${firstChat.id}`,
                { unread: false }
              );
              dispatch(
                updateChatUnread({ chatId: firstChat.id, unread: false })
              );
            }

            // Gửi vào Redux: có cả messages, không bị trống
            dispatch(setSelectedChat({ ...firstChat, messages: chatMessages }));
          } catch (err) {
            console.error("Không thể load tin nhắn đầu tiên:", err);
          }
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
      let messages = res.data || [];

      // Sắp xếp tin nhắn theo thời gian tăng dần
      messages = messages.sort((a, b) => a.createdAt - b.createdAt);

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
