import { IsEmail, IsEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class UserToBeValidateDTO {
    
    @IsEmpty()
    _id: mongoose.Types.ObjectId;

    @IsEmail()
    @IsEmpty({message:'Email field is required'})
    email: string;

    @IsString()
    @IsEmpty({message:'Password field is required'})
    password: string;
}