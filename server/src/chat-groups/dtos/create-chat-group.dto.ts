import { IsString, Length } from "class-validator";

export class CreateChatGroupDTO{
    @IsString()
    @Length(2,30)
    chatGroupName: string;
    
    users: Object[];

}