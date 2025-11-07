import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chatSlice";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
    auth: authReducer,
  },
});
