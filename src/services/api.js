import axios from "axios";

const API = axios.create({
  baseURL: "https://6905d07aee3d0d14c133cc68.mockapi.io",
});

// Lấy danh sách chat
export const getChats = () => API.get("/chats");

// Lấy tin nhắn của 1 chat
export const getMessages = (chatId) => API.get(`/messages?chatId=${chatId}`);

// Gửi tin nhắn mới
export const sendMessage = (data) => API.post("/messages", data);

// Tạo đoạn chat mới
export const createChat = (data) => API.post("/chats", data);

// Xoá tin nhắn
export const deleteMessage = (id) => API.delete(`/messages/${id}`);
