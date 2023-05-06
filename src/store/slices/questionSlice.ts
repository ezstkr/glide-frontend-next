import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../store';
import { $axios, $error_can_happen } from '../utils/api';
import { Question, QuestionInit, GetQuestion, NextQuestion, GetNextQuestion } from '../../src/shared/question';

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

// Actual Slice
export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    setItem(state, action: PayloadAction<Question>) {
      state.item = action.payload;
    },
    setNextItem(state, action: PayloadAction<NextQuestion>) {
      state.nextItem = action.payload;
    },
  },
});

export const { setItem, setNextItem } = questionSlice.actions;

export const selectQuestionItem = (state: AppState) => state.question.item;
export const selectQuestionNextItem = (state: AppState) => state.question.nextItem;

export default questionSlice.reducer;

export const getQuestion = ({ id }: GetQuestion) => async (dispatch) => {
  const item = await $error_can_happen(() => $axios.$get(`/questions/${id}`));
  dispatch(setItem(item));
};

export const getNextQuestion = ({ onlyUnsolved }: GetNextQuestion) => async (dispatch) => {
  const nextItem = await $error_can_happen(() => $axios.$get(`/users/next-question?onlyUnsolved=${onlyUnsolved}`));
  dispatch(setNextItem(nextItem));
};
