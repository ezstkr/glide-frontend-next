import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import axios from '@/lib/api'
import { error_can_happen } from '@/hooks/util'
import { UpdateUserQuestion, CreateCurriculumForm } from '@/shared/types/user'

// Type for our state
export interface UserState {
  userCurriculum: UpdateUserQuestion[];
}

// Initial state
const initialState: UserState = {
  userCurriculum: [],
};

export const createCurriculum = createAsyncThunk(
  'user/createCurriculum',
  async ({newbie, topics, difficulty}: CreateCurriculumForm, { rejectWithValue }) => {
    try {
      const userCurriculum = await axios.post(`/users/curriculum`, { newbie, topics, difficulty });
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
      error_can_happen(async () => {
        await axios.post(`/users/question`, action.payload);
      });
    },

    createUsersCurriculum(state, action) {
        error_can_happen(async () => {
            const userCurriculum = await axios.post(`/users/question`, action.payload);
            state.userCurriculum = userCurriculum.data;
        });
    },
  },
});

export const { updateUserQuestion } = userSlice.actions;

export const selectUserCurriculum = (state: AppState) => state.user.userCurriculum;

export default userSlice.reducer;
