import { Expose, Exclude } from "class-transformer";
import { IsEmpty } from "class-validator";
export class AuthenticatedUserDTO {
    @Exclude()
    @IsEmpty({message:'Users must be authenticated, authentication is required !'})
    access_token:string;
    
    @Expose()
    @IsEmpty()
    userId: number;
    
    @Expose()
    @IsEmpty()
    userEmail: string;
    
    @Expose()
    @IsEmpty()
    userName: string;
}