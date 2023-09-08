import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UsersRepository } from './users.repository';
import { UserProfileInfoDTO } from './dtos/user-profile-info.dto';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { UserDataDTO } from './dtos/user-data.dto';
import { FriendRelatedOperationsDTO } from './dtos/add-or-remove-friend.dto';
import { IUsersService } from 'interfaces/user-service.interface';
import { CreateUserDTO } from './dtos/create-user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
@Injectable()
export class UsersService implements IUsersService {
    
    constructor( 
        private usersRepository: UsersRepository,
        @InjectMapper() private readonly ReturnMapper: Mapper,
        ){}

    async createUser({name, email, password}:{name:string, email:string, password:string}): Promise<CreateUserDTO>{
        const newUser = await this.usersRepository.createUser(name, email, password);
        return newUser;
    }
    async findUser({id}:{id: mongoose.Types.ObjectId} ){
        try {
            if(!id){
                return null;
            }
            return await this.usersRepository.findUserByObjectId(id);
        } catch (error) {
            throw new Error(error);
        }
    }
    async findUserByEmail({email}:{email: string}){
        try {
            return await this.usersRepository.findByEmail(email);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addChatGroupToUser({userId,chatGroup}:{userId:mongoose.Types.ObjectId, chatGroup:object}){
        try {
            return await this.usersRepository.addChatGroupToUser(userId, chatGroup);
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeChatGroupFromUser({user , chatGroup}:{user:any , chatGroup:any} ){
        try {
            await this.usersRepository.removeChatGroupFromUser(user,chatGroup);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addFriend({userId, friend}:{userId:mongoose.Types.ObjectId, friend:object}) {
        try {
            const processedUser = await this.usersRepository.addFriend(userId, friend);
            const { _id, name, email, ChatGroups, Friends } = processedUser;
            const updatedUserDTO = new FriendRelatedOperationsDTO();
            updatedUserDTO._id = _id;
            updatedUserDTO.name = name;
            updatedUserDTO.email = email;
            updatedUserDTO.ChatGroups = ChatGroups;
            updatedUserDTO.Friends = Friends;
            return updatedUserDTO;
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeFriend({userId, friendId}:{userId:mongoose.Types.ObjectId, friendId:string}) {
        try {
            const processedUser = await this.usersRepository.removeFriend(userId, friendId);
            const { _id, name, email, ChatGroups, Friends } = processedUser;
            const updatedUserDTO = new FriendRelatedOperationsDTO();
            updatedUserDTO._id = _id;
            updatedUserDTO.name = name;
            updatedUserDTO.email = email;
            updatedUserDTO.ChatGroups = ChatGroups;
            updatedUserDTO.Friends = Friends;
            return updatedUserDTO;

        } catch (error) {
            throw new Error(error);
        }
    }
    async getFriendsOfUser( {userId} : {userId: mongoose.Types.ObjectId}) {
        try {
            return await this.usersRepository.getFriendsOfUser(userId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUserData( {userObject} : {userObject: object} ){
        try {
            return await this.usersRepository.getUserData(userObject);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUsersFriendsData({userId} : {userId: mongoose.Types.ObjectId}) {
        try {
            return await this.usersRepository.getUsersFriendsData(userId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUserProfileInfo({id, name, email, chatGroupDetails, friendsData}:{id: string, name: string, email: string, chatGroupDetails: ChatGroupInfoDTO[], friendsData:UserDataDTO[]}){
        const userProfileInfo = new UserProfileInfoDTO();
        userProfileInfo.UserId = id;
        userProfileInfo.UserName = name;
        userProfileInfo.UserEmail = email;
        userProfileInfo.ChatGroups = chatGroupDetails;
        userProfileInfo.Friends = friendsData;
      
        return userProfileInfo;
    }
    async searchUser({searchText}:{searchText:string}) {
        return await this.usersRepository.searchUser(searchText);
    }   
}
