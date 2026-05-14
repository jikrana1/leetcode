import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../slice/auth.slice.js";
import { chatSlice } from "../slice/chatAi.slice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    chat : chatSlice.reducer
  }
})