import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notification: [],
};

export const notificationReducerSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action) => {
      return {
        ...state,
        notification: action.payload,
      };
    },
  },
});

export const { setNotification } = notificationReducerSlice.actions;

export default notificationReducerSlice.reducer;
