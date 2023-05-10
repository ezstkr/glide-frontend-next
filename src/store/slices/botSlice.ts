import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { MessageData } from "react-chat-bot/src/shared/types/react-chat-bot";

// Type for our state
export interface BotState {
  isOpen: boolean;
  messageData: MessageData[];
}

// Initial state
const initialState: BotState = {
  isOpen: false,
  messageData: [],
};

// Actual Slice
export const botSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    // Action to set the authentication status
    setIsOpen(state, action) {
      state.isOpen = action.payload;
    },

    setMessageData(state, action) {
      state.messageData = action.payload
    },
  
    addMessageData(state, action) {
      state.messageData.push(action.payload)
    },
  
    clearMessageData(state) {
      state.messageData = []
    },
  },
});

export const { setIsOpen, setMessageData, addMessageData, clearMessageData } = botSlice.actions;

export const selectBotisOpen = (state: AppState) => state.bot.isOpen;
export const selectBotMessageData = (state: AppState) => state.bot.messageData;

export default botSlice.reducer;