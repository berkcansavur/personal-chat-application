import mongoose from "mongoose";

export class UserDataDTO {
    _id: string;
    name: string;
    email: string;
    ChatGroups: mongoose.Types.ObjectId[];
}