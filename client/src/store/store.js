import { configureStore } from "@reduxjs/toolkit";
import  userDetail  from "../Reducers/userDetail";
import checkLogin from "../Reducers/checkLogin";
import  chatSlice  from "../Reducers/selectedChats";
import  chatReducerSlice  from "../Reducers/chatReducer";
import  fetchReducer  from "../Reducers/fetchAgain";
import  errorReducer  from "../Reducers/errorHandling";
import  notificationReducerSlice  from "../Reducers/notificationsReducer";

export const store = configureStore({
  reducer: {
    app:userDetail,
    log: checkLogin,
    selectedChat : chatSlice ,
    chat : chatReducerSlice ,
    fetch : fetchReducer ,
    error : errorReducer,
    notification  : notificationReducerSlice,
  },
});