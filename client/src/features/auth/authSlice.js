import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
const userToken = sessionStorage.getItem("token");

const initialState  = {
    loading: false,
    accessToken: userToken,
    error:null,
    success:false,
    loggedIn: userToken && userToken.length> 4 ? true : false,
};
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ( credentials ) => {
        const request = await axios.post('http://localhost:3001/app/login', {
            email: credentials.email,
            password: credentials.password
        },{ withCredentials: true })
        const response = await request.data;
        sessionStorage.setItem("token", response.access_token);
        return response;
    }
)
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async( token ) => {
            const request = await axios.get("http://localhost:3001/app/logout", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const response = await request.data;
          sessionStorage.setItem("token", null);
          return response;
    }
)
const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loading = true;
            state.success = false;
            state.accessToken = null;
            state.error = null;
        })
        .addCase(loginUser.fulfilled,(state, action)=>{
            state.loading = false;
            state.success = true;
            state.accessToken = action.payload.access_token;
            state.error = null;
            state.loggedIn =true;
        })
        .addCase(loginUser.rejected, ( state, action)=>{
            state.loading = false;
            state.success = false;
            state.accessToken = null;
            if(action.error.code === 403){
                state.error = 'Access denied! Invalid credentials';
            }else{
                state.error = action.error.message;
            }
        })
        .addCase(logoutUser.pending,(state)=>{
            state.loading = true;
            state.success = false;
            state.accessToken = null;
            state.error = null;
        })
        .addCase(logoutUser.fulfilled,(state)=>{
            state.loading = false;
            state.success = true;
            state.accessToken = null;
            state.error = null;
            state.loggedIn = false;
        })
        .addCase(logoutUser.rejected,( state, action)=>{
            state.loading = false;
            state.success = false;
            state.accessToken = null;
            if(action.error.code === 401){
                state.error = 'Access denied! Invalid credentials';
            }else{
                state.error = action.error.message;
            }
        })
        

    }
})
export default authSlice.reducer