import mongoose from "mongoose";

export class FriendRelatedOperationsDTO{
    _id: string;
    name: string;
    email: string;
    ChatGroups: mongoose.Types.ObjectId[];
    Friends: mongoose.Types.ObjectId[];
}