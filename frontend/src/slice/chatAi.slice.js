import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  messages: [{
    role: "model",
    parts: [{ text: " Hi! Ask me anything about this problem." }]
  }]
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetChat: (state) => {
      state.messages = initialState.messages
    }
  }
})
export const { addMessage, resetChat } = chatSlice.actions;
