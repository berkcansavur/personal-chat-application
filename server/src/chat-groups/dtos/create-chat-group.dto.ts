import { IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateChatGroupDTO{
    @IsString()
    chatGroupName: string;
    
    users: mongoose.Types.ObjectId[];

    createdDate: Date;
}