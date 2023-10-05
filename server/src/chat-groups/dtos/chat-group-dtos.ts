import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";
import mongoose from "mongoose";

export class ReturnChatGroupDTO{
    @IsMongoId()
    _id: string;

    @IsString()
    chatGroupName: string;

    users: any[];
};

export class CreateChatGroupDTO{
    @IsString()
    @Length(2,30)
    chatGroupName: string;
    
    users: Object[];

};

export class ChatGroupInfoDTO {
    _id: string;
    chatGroupName: string;
    users: mongoose.Types.ObjectId[];
};

export class UpdateChatGroupsNameDTO {
    
    chatGroupId: string;
    
    @IsString()
    @IsNotEmpty()
    chatGroupName: string;
}
