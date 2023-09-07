import { Expose } from "class-transformer";
export class CurrentUserDTO {
    @Expose()
    userId: number;
    @Expose()
    userEmail: string;
    @Expose()
    userName: string;
}