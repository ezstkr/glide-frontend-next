import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import axios from '@/lib/api'
import { Question, QuestionInit, GetQuestion, NextQuestion, GetNextQuestion } from '@/shared/types/question'
import { getSession } from "next-auth/react";


// Type for our state
export interface QuestionState {
  item: Question;
  nextItem: NextQuestion;
}

// Initial state
const initialState: QuestionState = {
  item: QuestionInit,
  nextItem: {
    questionId: '',
  },
};

export const getQuestion = createAsyncThunk(
  'question/get',
  async ({id}: GetQuestion, { rejectWithValue }) => {
    const session: any = await getSession()

    try {
      const response = await axios.get(`/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getNextQuestion = createAsyncThunk(
  'question/getNext',
  async ({onlyUnsolved}: GetNextQuestion, { rejectWithValue }) => {
    const session: any = await getSession()

    try {
      const response = await axios.get(`/users/next-question?onlyUnsolved=${onlyUnsolved}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Actual Slice
export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuestion.fulfilled, (state, action) => {
        state.item = action.payload;
      })
      .addCase(getNextQuestion.fulfilled, (state, action) => {
        state.nextItem = action.payload;
      });
  },
});

export const selectQuestionItem = (state: AppState) => state.question.item;
export const selectQuestionNextItem = (state: AppState) => state.question.nextItem;

export default questionSlice.reducer;
