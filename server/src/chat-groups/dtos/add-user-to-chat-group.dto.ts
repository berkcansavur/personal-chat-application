import mongoose from "mongoose";

export class AddUserToTheChatGroupDTO{
    
    
    chatGroupId:mongoose.Types.ObjectId;
    
    
    userId:mongoose.Types.ObjectId;
}