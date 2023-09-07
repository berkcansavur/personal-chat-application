import mongoose from "mongoose";

export class ChatGroupInfoDTO {
    _id: mongoose.Types.ObjectId;
    chatGroupName: string;
    users: object[];
}