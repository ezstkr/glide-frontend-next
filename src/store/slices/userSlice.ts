import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import axios from '@/lib/api'
import { error_can_happen } from '@/hooks/util'
import { UpdateUserQuestion, CreateCurriculumForm } from '@/shared/types/user'
import { getSession, useSession } from "next-auth/react"

type UserState = {
  userCurriculum: UpdateUserQuestion[];
};

const initialState: UserState = {
  userCurriculum: [],
};


export const updateUserQuestion = createAsyncThunk(
  'user/updateUserQuestion',
  async (payload: UpdateUserQuestion) => {
    const { questionId, solved, correct } = payload;
    await error_can_happen(async () => {
      await axios.post(`/users/question`, { questionId, solved, correct });
    });
  }
);

export const createCurriculum = createAsyncThunk(
  'user/createCurriculum',
  async (payload: CreateCurriculumForm, { rejectWithValue }) => {
    const session: any = await getSession()

    try {
      const response = await axios.post(`/users/curriculum`, payload, {
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


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateUserQuestion.fulfilled, (state, action) => {
      // You can update the state based on the action result here, if needed.
    });
    builder.addCase(createCurriculum.fulfilled, (state, action) => {
      state.userCurriculum = action.payload;
    });
  },
});

export const selectUserCurriculum = (state: AppState) => state.user.userCurriculum;

export default userSlice.reducer;
