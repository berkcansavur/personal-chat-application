import { Expose, Exclude } from "class-transformer";
import mongoose from "mongoose";

export class CurrentUserDTO {
    @Exclude()
    userId: number;
    @Expose()
    email: string;
    @Expose()
    name: string;
}
export class AddFriendDTO {
    friendId: mongoose.Types.ObjectId;
}