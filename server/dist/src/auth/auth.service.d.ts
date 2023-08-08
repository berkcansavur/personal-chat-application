import { UsersService } from 'src/users/users.service';
import { UserDTO } from 'src/users/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userService;
    private jwtTokenService;
    constructor(userService: UsersService, jwtTokenService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    loginWithCredentials(user: UserDTO): Promise<{
        access_token: string;
        user: {
            userId: number;
            userName: string;
            userEmail: string;
        };
    }>;
}
