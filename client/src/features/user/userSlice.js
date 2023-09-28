import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const initialState  = {
    loading: false,
    userProfileInfo:{},
    error:null,
    success:false,
};
export const signupUser = createAsyncThunk(
    'user/signup',
    async (payload)=>{
        const request = await axios.post('http://localhost:3001/users/signup',{
      name: payload.name,
      email: payload.email,
      password: payload.password
    });
    const response = await request.data;
    return response;
    }
)
export const getProfileData = createAsyncThunk(
    'user/profile',
    async (token) => {
        const request = await axios.get("http://localhost:3001/app/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        const response = await request.data;
        return response;
    }
)
const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers:( builder ) => {
        builder
        .addCase(getProfileData.pending, ( state ) => {
            state.loading = true;
            state.userProfileInfo = null;
            state.success = false;
            state.error = null;
        })
        .addCase(getProfileData.fulfilled,( state, action ) => {
            state.loading = false;
            state.userProfileInfo = action.payload;
            state.success = true;
            state.error = null;
        })
        .addCase(getProfileData.rejected, ( state, action ) => {
            state.loading = false;
            state.userProfileInfo = null;
            state.success= false;
            if(action.error.code === 401){
                state.error = 'Access denied! Unauthorized';
            }else{
                state.error = action.error.message;
            }
        })
        .addCase(signupUser.pending, ( state ) => {
            state.loading = true;
            state.userProfileInfo = null;
            state.error = null;
            state.success = null;
        })
        .addCase(signupUser.fulfilled, (state) => {
            state.loading = false;
            state.userProfileInfo = null;
            state.error = null;
            state.success = true;
        })
        .addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.userProfileInfo = null;
            state.error = action.error.message;
            state.success = false;
        })
    }
})

export default userSlice.reducer;