import mongoose from "mongoose";
export declare class UserDTO {
    userId: number;
    email: string;
    name: string;
}
export declare class AddFriendDTO {
    friendId: mongoose.Types.ObjectId;
}
