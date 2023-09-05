import {
    Body, 
    Controller, 
    Post, 
    Get, 
    Session,
    UseGuards,
    Request } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UtilsService } from '../utils/utils.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { UserProfileDTO } from './dtos/user-profile.dto';
import { CurrentUserDTO } from './dtos/current-user.dto';
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
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    loginUser(@Request() req):any{
        console.log(req.body)
        try {
            console.log(req.user);
            return {
                User: req.user,
                message:'User logged in successfully'
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
    @Post('/logout')
    async logoutUser(@Session() session: any){
        session.userId = null;
        session.CurrentUser = null;
    }
    @UseGuards(JwtAuthGuard)
    
    @Get('/me')
    getUserProfile( @Request() req){
        try {
            const currentUser = new CurrentUserDTO();
            currentUser.userId = req.session.userId;
            currentUser.userEmail = req.session.CurrentUser.email;
            currentUser.userName = req.session.CurrentUser.name
            return currentUser;
            
        } catch (error) {
            throw new Error(error);
        }
    }
}
