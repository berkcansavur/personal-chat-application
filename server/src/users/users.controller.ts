import {
    Body, 
    Controller, 
    Post, 
    Session, } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UtilsService } from '../utils/utils.service';
import { ReturnUserDTO } from './dtos/return-user.dto';
@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private utilsService:UtilsService ){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDTO ) : Promise<ReturnUserDTO>{
        try {
            const hashedPassword = await this.utilsService.hashPassword(body.password);
            const createUserDTO = {
                name: body.name,
                email: body.email,
                password: hashedPassword,
                ChatGroups: null,
                Friends: null,
            }
            return await this.userService.createUser({createUserDTO});
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
