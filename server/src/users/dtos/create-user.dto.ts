import { IsEmail, IsString, Length } from "class-validator";
import mongoose from "mongoose";

export class CreateUserDTO {
    @IsString()
    @Length(2,30)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8,25)
    password: string;

    ChatGroups: mongoose.Types.ObjectId[];

    Friends: mongoose.Types.ObjectId[];
}