import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../store";
import axios from '@/lib/api'
import { getSession } from "next-auth/react"

import { UpdateUserQuestion, CreateCurriculumForm } from '@/shared/types/user'


type UserState = {
  userCurriculum: UpdateUserQuestion[];
};

const initialState: UserState = {
  userCurriculum: [],
};


export const updateUserQuestion = createAsyncThunk(
  'user/updateUserQuestion',
  async (payload: UpdateUserQuestion, { rejectWithValue }) => {
    const session: any = await getSession()
 
    try {
      const response = await axios.post(`/users/question`, payload, {
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
      const idx = state.userCurriculum.findIndex(item => item.questionId === action.payload.questionId)
      state.userCurriculum[idx] = action.payload
    });
    builder.addCase(createCurriculum.fulfilled, (state, action) => {
      state.userCurriculum = action.payload;
    });
  },
});

export const selectUserCurriculum = (state: AppState) => state.user.userCurriculum;

export default userSlice.reducer;
