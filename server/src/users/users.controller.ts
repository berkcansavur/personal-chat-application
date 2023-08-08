import {
    Param,
    Body, 
    Controller, 
    Post, 
    Get, 
    Session,
    UseGuards,
    Request,
    UnauthorizedException} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { UtilsService } from '../utils/utils.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AddFriendDTO } from './dtos/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private utilsService:UtilsService ){}

    @Post('/signup')
    async createUser(@Body() body: CreateUserDTO, @Session() session: any){
        try {
            const hashedPassword = await this.utilsService.hashPassword(body.password);
            const user = await this.userService.createUser(body.name,body.email,hashedPassword);
            return {
                name:user.name,
                email:user.email
            };
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
                User:req.user,
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
    getUserProfile(@Request() req){
        try {
            return {
                userId:req.session.userId,
                userName:req.session.CurrentUser.name,
                userEmail:req.session.CurrentUser.email

            };
            
        } catch (error) {
            throw new Error(error);
        }
    }
}
