import { IsMongoId, IsString } from "class-validator";
import mongoose from "mongoose";

export class ReturnChatGroupDTO{
    @IsMongoId()
    _id: mongoose.Types.ObjectId;

    @IsString()
    chatGroupName: string;

    users:mongoose.Types.ObjectId[];
}