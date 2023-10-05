import { IsEmail, IsEmpty, IsString, IsMongoId, Length } from "class-validator";
import { Expose, Exclude } from "class-transformer";
import mongoose from "mongoose";
import { ChatGroupInfoDTO } from "src/chat-groups/dtos/chat-group-dtos";

export class UserToBeValidateDTO {
    
    @IsEmpty()
    _id: string;

    @IsEmail()
    @IsEmpty({message:'Email field is required'})
    email: string;

    @IsString()
    @IsEmpty({message:'Password field is required'})
    password: string;
}

export class UserProfileInfoDTO {
    UserId: string;
    UserName: string;
    UserEmail: string;
    ChatGroups: any[];
    Friends: any[];
}

export class UserDataDTO {
    _id: string;
    name: string;
    email: string;
    ChatGroups: mongoose.Types.ObjectId[];
}

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

export class LoginUserDTO {

    @IsEmail()
    @IsEmpty({message:'Email field is required'})
    email: string;

    @IsString()
    @IsEmpty({message:'Password field is required'})
    password: string;
}

export class FriendInfoDTO{
    _id: string;
    name: string;
    email: string;
}

export class CurrentUserDTO {
    @Expose()
    userId: string;
    @Expose()
    userName: string;
    @Expose()
    userEmail: string;
}

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

export class AuthenticatedUserDTO {
    @Exclude()
    @IsEmpty({message:'Users must be authenticated, authentication is required !'})
    access_token:string;
    
    @Expose()
    @IsEmpty()
    userId: string;
    
    @Expose()
    @IsEmpty()
    userEmail: string;
    
    @Expose()
    @IsEmpty()
    userName: string;
}
export class MapUserInfoDTO {

    UserId: string;

    UserName: string;

    UserEmail: string;

    ChatGroupDetails: ChatGroupInfoDTO[];
    
    FriendsData:FriendInfoDTO[];
}