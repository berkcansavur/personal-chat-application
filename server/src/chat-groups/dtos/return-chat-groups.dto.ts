import { IsMongoId, IsString } from "class-validator";

export class ReturnChatGroupDTO{
    @IsMongoId()
    _id: string;

    @IsString()
    chatGroupName: string;

    users: any[];
}