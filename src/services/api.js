import axios from "axios";

const API = axios.create({
  baseURL: "https://6905d07aee3d0d14c133cc68.mockapi.io",
});

// --- Chats ---
export const getChats = () => API.get("/chats");
export const getChatDetail = (chatId) => API.get(`/chats/${chatId}`);
export const createChat = (data) => API.post("/chats", data);
export const updateChat = (chatId, data) => API.put(`/chats/${chatId}`, data);
export const deleteChat = (chatId) => API.delete(`/chats/${chatId}`);

// --- Messages ---
export const getMessages = (chatId) => API.get(`/messages?chatId=${chatId}`);
export const getAllMessages = () => API.get("/messages");
export const sendMessage = (data) => API.post("/messages", data);
export const deleteMessage = (id) => API.delete(`/messages/${id}`);
