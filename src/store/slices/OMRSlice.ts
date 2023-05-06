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
export const omrSlice = createSlice({
  name: "OMR",
  initialState,
  reducers: {
    // Action to update answer of a question
    update(state, action) {
      const { index, correct } = action.payload;
      state.item[index] = correct;
    },
  },
});

export const { update } = omrSlice.actions;

export const selectOMRItem = (state: AppState) => state.OMR.item;

export default omrSlice.reducer;
