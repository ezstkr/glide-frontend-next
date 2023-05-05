import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { $axios, $error_can_happen } from '../utils/api'
import { UpdateUserQuestion, CreateCurriculumForm } from '~/src/shared/user'

// Type for our state
export interface UserState {
  userCurriculum: UpdateUserQuestion[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state
const initialState: UserState = {
  userCurriculum: [],
  status: 'idle',
};

export const createCurriculum = createAsyncThunk(
  'user/createCurriculum',
  async ({newbie, topics, difficulty}: CreateCurriculumForm, { rejectWithValue }) => {
    try {
      const userCurriculum = await $axios.$post(`/users/curriculum`, { newbie, topics, difficulty });
      return userCurriculum;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Actual Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to update user question
    updateUserQuestion(state, action) {
      $error_can_happen(async () => {
        await $axios.$post(`/users/question`, action.payload);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCurriculum.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCurriculum.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userCurriculum = action.payload;
      })
      .addCase(createCurriculum.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { updateUserQuestion } = userSlice.actions;

export const selectUserCurriculum = (state: AppState) => state.user.userCurriculum;
export const selectUserStatus = (state: AppState) => state.user.status;

export default userSlice.reducer;
