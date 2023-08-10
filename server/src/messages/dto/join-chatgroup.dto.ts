import mongoose from "mongoose";

export class JoinChatGroupDTO {
    chatGroupId:mongoose.Types.ObjectId;
    userId:mongoose.Types.ObjectId;
    clientId:string;
}