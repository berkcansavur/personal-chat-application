import { IsEmail, IsEmpty, IsString, Length } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @IsEmpty({message:' User must have a valid name'})
    @Length(2,30)
    name: string;

    @IsEmail()
    @IsEmpty({message:' User must have a valid email'})
    email: string;

    @IsString()
    @IsEmpty({message:' User must have a valid password'})
    @Length(8,25)
    password: string;
}