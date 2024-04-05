import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChat: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      return {
        ...state,
        selectedChat: action.payload,
      };
    },
  },
});

export const { setSelectedChat } = chatSlice.actions;

export default chatSlice.reducer;
