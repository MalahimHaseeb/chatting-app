import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chat: [],
};

export const chatReducerSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (state, action) => {
      return {
        ...state,
        chat: action.payload,
      };
    },
  },
});

export const { setChat } = chatReducerSlice.actions;

export default chatReducerSlice.reducer;
