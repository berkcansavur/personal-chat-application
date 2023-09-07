import { IsEmail, IsEmpty, IsString } from "class-validator";

export class LoginUserDTO {

    @IsEmail()
    @IsEmpty({message:'Email field is required'})
    email: string;

    @IsString()
    @IsEmpty({message:'Password field is required'})
    password: string;
}