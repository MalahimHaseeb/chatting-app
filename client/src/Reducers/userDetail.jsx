import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//  create action
export const createUser = createAsyncThunk("createUser", async (data,{rejectWithValue}) => {
    const responce = await fetch(`${import.meta.env.VITE_MOCK_API}/user/register`,{
        method:"POST" ,
        headers:{
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(data)
    });
    try {
        const result = await responce.json()
        console.log(result)
        return result ;
    } catch (error) {
        // console.log(error.message)
        return rejectWithValue(error)
    }
})
//  create action
export const createLogin = createAsyncThunk("createLogin", async (data,{rejectWithValue}) => {
  const responce = await fetch(`${import.meta.env.VITE_MOCK_API}/user/login`,{
      method:"POST" ,
      headers:{
          "Content-Type" : "application/json",
      },
      body: JSON.stringify(data)
  });
  try {
      const result = await responce.json()
      console.log(result)
      return result ;
  } catch (error) {
      // console.log(error.message)
      return rejectWithValue(error)
  }
})
export const userDetail = createSlice({
    name: "userDetail",
    initialState: {
      users: [],
      loading: false,
      error: null,
    },
    reducers: {
    
    }, // You can add any additional reducers here
    extraReducers: (builder) => {
      builder
        .addCase(createUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(createUser.fulfilled, (state, action) => {
          state.loading = false;
          state.users.push(action.payload);
        })
        .addCase(createUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createLogin.pending, (state) => {
          state.loading = true;
        })
        .addCase(createLogin.fulfilled, (state, action) => {
          state.loading = false;
          state.users.push(action.payload);
        })
        .addCase(createLogin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    },
  });
  export default userDetail.reducer;