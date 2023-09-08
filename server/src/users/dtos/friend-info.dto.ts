import mongoose from "mongoose";

export class FriendInfoDTO{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
}