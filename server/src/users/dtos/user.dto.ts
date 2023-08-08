import { Expose, Exclude } from "class-transformer";
import mongoose, { Mongoose } from "mongoose";
export class UserDTO {
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