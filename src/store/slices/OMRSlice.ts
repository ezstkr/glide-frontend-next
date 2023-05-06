import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

// Type for our state
export interface OMRState {
  n_question: number;
  item: boolean[];
}

// Initial state
const initialState: OMRState = {
  n_question: 5,
  item: Array(5).fill(null),
};

// Actual Slice
export const OMRSlice = createSlice({
  name: "OMR",
  initialState,
  reducers: {
    initOMR(state, action) {
      state.item = Array(state.n_question).fill(null);
    },
  
    updateOMR(state, action) {
      const { index, correct } = action.payload;
      state.item[index] = correct;
    },
  },
});

export const { initOMR, updateOMR } = OMRSlice.actions;

export const selectNQuesetion = (state: AppState) => state.OMR.n_question;
export const selectOMRItem = (state: AppState) => state.OMR.item;

export default OMRSlice.reducer;
