import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
const initialState  = {
    loading: false,
    chatGroupData:{},
    error:null,
    success:false,
};
const token  = sessionStorage.getItem("token");
export const getChatGroupData = createAsyncThunk(
    'chatGroups/getChatGroupData',
    async ( chatGroupId ) => {
        const request = await axios.get(`http://localhost:3001/app/get-chat-group/${chatGroupId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        const response = await request.data;
        return response;
    }
);
export const addUserToChatGroup = createAsyncThunk(
    'chatGroups/addFriendToChatGroup',
    async ( parameters) => {
        const { chatGroupId, friendId } = parameters;
        const request = await axios.post(
            `http://localhost:3001/app/add-friends-to-chat-group/${chatGroupId}/${friendId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        const response = await request.data;
        return response;
    }
)
export const removeUserFromChatGroup = createAsyncThunk(
    'chatGroups/removeUserFromChatGroup',
    async ( parameters) => {
        const { chatGroupId, friendId } = parameters;
        const request = await axios.post(
            `http://localhost:3001/app/remove-friends-from-chat-group/${chatGroupId}/${friendId}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        const response = await request.data;
        return response;
    }
)
export const deleteChatGroup = createAsyncThunk(
    'chatGroups/deleteChatGroup',
    async(chatGroupId) => {
        const request = await axios.delete(`http://localhost:3001/app/delete-chat-group/${chatGroupId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    const response = await request.data;
    return response;
    }
)
const chatGroupSlice = createSlice({
    name: 'chatGroups',
    initialState,
    extraReducers:(builder) =>{
        builder
        .addCase(getChatGroupData.pending, ( state ) => {
            state.loading = true;
            state.chatGroupData = null;
            state.success = false;
            state.error = null;
        })
        .addCase(getChatGroupData.fulfilled, ( state, action ) => {
            state.loading = false;
            state.chatGroupData = action.payload;
            state.success = true;
            state.error = null;
        })
        .addCase(getChatGroupData.rejected, ( state, action ) => {
            state.loading = false;
            state.chatGroupData = null;
            state.success = false;
            if(action.error.code === 401){
                state.error = 'Access denied! Unauthorized';
            }else{
                state.error = action.error.message;
            }
        })
        .addCase(removeUserFromChatGroup.pending, ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(removeUserFromChatGroup.fulfilled, ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.chatGroupData = action.payload;
        })
        .addCase(removeUserFromChatGroup.rejected, ( state, action ) => {
            state.loading = false;
            state.success = false;
            if(action.error.code === 401){
              state.error = 'Access denied! Unauthorized';
            } else {
              state.error = action.error.message;
            }
        })
        .addCase(addUserToChatGroup.pending, ( state ) => {
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(addUserToChatGroup.fulfilled, ( state, action ) => {
            state.loading = false;
            state.success = true;
            state.error = null;
            state.chatGroupData = action.payload;
        })
        .addCase(addUserToChatGroup.rejected, ( state, action ) => {
            state.loading = false;
            state.success = false;
            if(action.error.code === 401){
                state.error = 'Access denied! Unauthorized';
            }else{
                state.error = action.error.message;
            }
        })
        .addCase(deleteChatGroup.pending, ( state )=>{
            state.loading = true;
            state.success = false;
            state.error = null;
        })
        .addCase(deleteChatGroup.fulfilled, ( state ) =>{
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase(deleteChatGroup.rejected, ( state, action )=>{
            state.loading = false;
            state.success = false;
            if(action.error.code === 401){
                state.error = 'Access denied! Unauthorized';
            }else{
                state.error = action.error.message;
            }
        })
    }
})
export default chatGroupSlice.reducer;