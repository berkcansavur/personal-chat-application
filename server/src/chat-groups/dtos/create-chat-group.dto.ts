import { IsString } from "class-validator";

export class CreateChatGroupDTO{
    @IsString()
    chatGroupName: string;
    
    users: object[];

    createdDate: Date;
}