import { Expose, Exclude } from "class-transformer";
import mongoose from "mongoose";

export class CurrentUserDTO {
    @Expose()
    userId: number;
    @Expose()
    userEmail: string;
    @Expose()
    userName: string;
}
export class AddFriendDTO {
    friendId: mongoose.Types.ObjectId;
}