import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
    filter: "all",
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    updateChatUnread: (state, action) => {
      const { chatId, unread } = action.payload;
      state.chats = state.chats.map((c) =>
        c.id === chatId ? { ...c, unread } : c
      );
    },
  },
});

export const { setChats, setSelectedChat, setFilter, updateChatUnread } =
  chatSlice.actions;
export default chatSlice.reducer;
