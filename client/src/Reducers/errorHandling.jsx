import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: false,
};

export const errorReducer = createSlice({
  name: 'error',
  initialState,
  reducers: {
    toggleFetchAgain: state => {
      state.error = !state.error;
    },
  },
});

export const { toggleFetchAgain } = errorReducer.actions;

export default errorReducer.reducer;
