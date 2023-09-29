import { configureStore } from "@reduxjs/toolkit";
import auth from '../features/auth/authSlice';
import user from '../features/user/userSlice';
import chatGroups from '../features/chatgroups/chatgroupSlice';
const store = configureStore({
    reducer:{
        auth,
        user,
        chatGroups
    }
})
export default store; 