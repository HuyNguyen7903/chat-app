import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import MainChat from "../MainChat/MainChat";
import InfoUser from "../InfoUser/InfoUser";
import "../../themes/theme-dark.css";
import "../../themes/theme-light.css";
import "./Index.css";
import {
  getChats,
  getMessages,
  getAllMessages,
  updateChat,
} from "../../../services/api";
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

  const [showInfo, setShowInfo] = useState(false);

  // Lấy danh sách chat từ MockAPI
  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await getChats();
        const chatList = res.data;

        // ✅ Lấy toàn bộ messages qua api.js
        const resMessages = await getAllMessages();
        const allMessages = resMessages.data;

        // Ghép messages vào từng chat
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

        dispatch(setChats(mergedChats));

        // Nếu chưa có selectedChat → chọn đoạn đầu tiên
        if (mergedChats.length > 0 && !selectedChat) {
          const firstChat = mergedChats[0];

          try {
            // Lấy messages của chat đầu tiên
            const resMsgs = await getMessages(firstChat.id);
            let chatMessages = resMsgs.data || [];

            chatMessages = chatMessages.sort(
              (a, b) => a.createdAt - b.createdAt
            );

            // ✅ Dùng updateChat() thay cho axios.put()
            if (firstChat.unread) {
              await updateChat(firstChat.id, { unread: false });
              dispatch(
                updateChatUnread({ chatId: firstChat.id, unread: false })
              );
            }

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
      // Nếu chưa đọc → cập nhật lại
      if (chat.unread) {
        try {
          // ✅ Dùng updateChat() thay cho axios.put()
          await updateChat(chat.id, { unread: false });
          dispatch(updateChatUnread({ chatId: chat.id, unread: false }));
        } catch (updateErr) {
          console.error("Không thể cập nhật trạng thái đọc:", updateErr);
        }
      }

      const res = await getMessages(chat.id);
      let messages = res.data || [];

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
