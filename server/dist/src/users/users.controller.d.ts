import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UtilsService } from '../utils/utils.service';
export declare class UsersController {
    private userService;
    private utilsService;
    constructor(userService: UsersService, utilsService: UtilsService);
    createUser(body: CreateUserDTO, session: any): Promise<{
        name: string;
        email: string;
    }>;
    loginUser(req: any): any;
    logoutUser(session: any): Promise<void>;
    getUserProfile(req: any): {
        userId: any;
        userName: any;
        userEmail: any;
    };
}
