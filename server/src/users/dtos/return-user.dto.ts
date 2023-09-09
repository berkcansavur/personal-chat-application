import { IsEmail, IsMongoId, IsString } from "class-validator";

export class ReturnUserDTO {
    @IsMongoId()
    _id: string;
    
    @IsString()
    name: string;
    
    @IsEmail()
    email: string;
    
    ChatGroups: any[];
    
    Friends: any[];
}