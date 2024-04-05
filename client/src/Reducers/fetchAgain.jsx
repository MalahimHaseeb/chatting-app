import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fetchAgain: false,
};

export const fetchReducer = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setFetchAgain: (state, action) => {
      state.fetchAgain = action.payload;
    },
  },
});

export const { setFetchAgain } = fetchReducer.actions;

export default fetchReducer.reducer;
