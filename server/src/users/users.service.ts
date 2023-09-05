import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersRepository } from './users.repository';
@Injectable()
export class UsersService {
    
    constructor(@InjectModel('Users') private userModel: Model<User>,
    private usersRepository: UsersRepository){}

    async createUser(name:string, email:string, password:string){
        const newUser = await this.usersRepository.createUser(name, email, password);
        return newUser;
    }
    async findUserById(id: string ){
        try {
            if(!id){
                return null;
            }
            return await this.usersRepository.findUserById(id);;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findUser(id: mongoose.Types.ObjectId ){
        try {
            if(!id){
                return null;
            }
            return await this.usersRepository.findUserByObjectId(id);;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findUserByEmail(email: string){
        try {
            return await this.usersRepository.findByEmail(email);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addChatGroupToUser(userId:string, chatGroup:object){
        try {
            return await this.usersRepository.addChatGroupToUser(userId, chatGroup);;
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeChatGroupFromUser(user , chatGroup ){
        try {
            await this.usersRepository.removeChatGroupFromUser(user,chatGroup);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addFriend(userId:string, friend:object) {
        try {
            return await this.usersRepository.addFriend(userId, friend);;
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeFriend(userId:string, friendId:string) {
        try {
            return await this.usersRepository.removeFriend(userId, friendId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getFriendsOfUser( userId:mongoose.Types.ObjectId) {
        try {
            return await this.usersRepository.getFriendsOfUser(userId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getFriendsOfUserById( userId:string) {
        try {
            return await this.usersRepository.getFriendsOfUserById(userId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUserData( userObject: Object ){
        try {
            return await this.usersRepository.getUserData(userObject);
        } catch (error) {
            throw new Error(error);
        }
    }
    async searchUser(searchText:string) {
        return await this.usersRepository.searchUser(searchText);
    }
}
