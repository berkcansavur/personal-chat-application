import mongoose from "mongoose";

export class UserProfileInfoDTO {
    UserId: mongoose.Types.ObjectId;
    UserName: string;
    UserEmail: string;
    ChatGroups: any[];
    Friends: any[];
}