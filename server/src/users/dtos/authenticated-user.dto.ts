import { Expose, Exclude } from "class-transformer";
export class AuthenticatedUserDTO {
    @Exclude()
    access_token:string;
    @Expose()
    userId: number;
    @Expose()
    userEmail: string;
    @Expose()
    userName: string;
}