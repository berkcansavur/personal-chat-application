import {
    Body, 
    Controller, 
    Post, 
    Session, } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UtilsService } from '../utils/utils.service';
import { UserProfileDTO } from './dtos/user-profile.dto';
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private utilsService:UtilsService ){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDTO ){
        try {
            const hashedPassword = await this.utilsService.hashPassword(body.password);
            const user = await this.userService.createUser(body.name,body.email, hashedPassword);
            const userProfileDTO = new UserProfileDTO();
            userProfileDTO.name = user.name;
            userProfileDTO.email = user.email;
            return userProfileDTO;
        } catch (error) {
            throw new Error(error);
        }
    }
    @Post('/logout')
    async logoutUser(@Session() session: any){
        session.userId = null;
        session.CurrentUser = null;
    }
}
