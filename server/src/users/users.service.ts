import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { UsersRepository } from './users.repository';
import { UserProfileInfoDTO } from './dtos/user-profile-info.dto';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { FriendRelatedOperationsDTO } from './dtos/add-or-remove-friend.dto';
import { IUsersService } from 'interfaces/user-service.interface';
import { CreateUserDTO } from './dtos/create-user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReturnUser, ReturnUserProfile } from './users.model';
import { ReturnUserDTO } from './dtos/return-user.dto';
import { FriendInfoDTO } from './dtos/friend-info.dto';

@Injectable()
export class UsersService implements IUsersService {
    
    constructor( 
        private usersRepository: UsersRepository,
        @InjectMapper() private readonly UserMapper: Mapper,
        ){}

    async createUser({createUserDTO}:{createUserDTO: CreateUserDTO}): Promise<ReturnUserDTO>{

        const {UserMapper} = this;
        const newUser : ReturnUser = await this.usersRepository.createUser({createUserDTO});
        return UserMapper.map< ReturnUser, ReturnUserDTO>(newUser,ReturnUser,ReturnUserDTO);
    }
    async findUser({id}:{id: mongoose.Types.ObjectId} ): Promise<UserProfileInfoDTO>{
        try {
            const {UserMapper} = this;
            const user = await this.usersRepository.findUserByObjectId(id);
            return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);
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
    async addFriend({userId, friendId}:{userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId}) {
        try {
            const {UserMapper} = this;
            const processedUser = await this.usersRepository.addFriend(userId, friendId);
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
    async removeFriend({userId, friendId}:{userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId}) {
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
    async getUserData( {userId} : {userId: mongoose.Types.ObjectId} ){
        try {
            return await this.usersRepository.getUserData(userId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUsersFriendsInfo({userIds}:{userIds: mongoose.Types.ObjectId[]}): Promise<FriendInfoDTO[]> {
        try {
            const {UserMapper} = this;
            const users = await this.usersRepository.getUserFriends(userIds);
            const usersData = Promise.all(users.map((user)=>{
                return UserMapper.map<ReturnUser, FriendInfoDTO>(user, ReturnUser,FriendInfoDTO)
            }))
            return usersData;
        } catch (error) {
          throw new Error(error);
        }
    }
    async getUsersFriendsData({userId} : {userId: mongoose.Types.ObjectId}) {
        try {
            const friends = await this.usersRepository.getFriendsOfUser(userId);
            const friendsData = Promise.all(friends.map( async (friendId) => {
                return await this.getUserData({userId:friendId});
            }));
            return friendsData;
        } catch (error) {
            throw new Error(error);
        }
    }
    async mapUserProfileInfo({id, name, email, chatGroupDetails, friendsData}:{id: mongoose.Types.ObjectId, name: string, email: string, chatGroupDetails: ChatGroupInfoDTO[], friendsData:FriendInfoDTO[]}){
        const {UserMapper} = this;
        const userProfileInfo = new UserProfileInfoDTO();
        userProfileInfo.UserId = id;
        userProfileInfo.UserName = name;
        userProfileInfo.UserEmail = email;
        userProfileInfo.ChatGroups = chatGroupDetails;
        userProfileInfo.Friends = friendsData;
        return UserMapper.map<UserProfileInfoDTO, ReturnUserProfile>(userProfileInfo, UserProfileInfoDTO,ReturnUserProfile)
        
    }
    async searchUser({searchText}:{searchText:string}) {
        return await this.usersRepository.searchUser(searchText);
    }   
}
