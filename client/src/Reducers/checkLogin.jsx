import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  user: null,
  token: "",
  role: null ,
  id : null
}
const storedAuth = localStorage.getItem('auth');
if (storedAuth) {
  const { name, token ,role , id} = JSON.parse(storedAuth);
  initialState.user = name;
  initialState.token = token;
  initialState.role = role;
  initialState.id = id;
}
export const userLogin = createSlice({
  name: 'userLogin',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.id = action.payload.id;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem('auth');
    }
  },
})
export const { loginUser, logoutUser } = userLogin.actions;
export default userLogin.reducer;