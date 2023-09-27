import { configureStore } from "@reduxjs/toolkit";
import user from '../features/auth/authSlice';

const store = configureStore({
    reducer:{
        user
    }
})
export default store; 