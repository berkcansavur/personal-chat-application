import { Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { UsersRepository } from './users.repository';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { IUsersService } from 'interfaces/user-service.interface';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { MapUserInfoDTO } from './dtos/user-dtos';
import { 
    ReturnUser, 
    ReturnUserProfile, 
    UserToBeValidate } from './users.model';
import { 
    UserToBeValidateDTO, 
    UserProfileInfoDTO,
    ReturnUserDTO,
    FriendInfoDTO,
    CreateUserDTO } from './dtos/user-dtos';

@Injectable()
export class UsersService implements IUsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor( 
        private usersRepository: UsersRepository,
        @InjectMapper() private readonly UserMapper: Mapper
        ){}

    async createUser({createUserDTO}:{createUserDTO: CreateUserDTO}): Promise<ReturnUserDTO>{

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] createUser: ${JSON.stringify(createUserDTO)}`);

        const newUser : ReturnUser = await this.usersRepository.createUser({createUserDTO});

        return UserMapper.map< ReturnUser, ReturnUserDTO>(newUser,ReturnUser,ReturnUserDTO);
    }
    async findUser({userId}:{userId: mongoose.Types.ObjectId} ): Promise<UserProfileInfoDTO>{
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] findUser: userId: ${JSON.stringify(userId)}`);

            const user = await this.usersRepository.findUserByObjectId(userId);

            return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUserToBeValidate({userId}:{userId: mongoose.Types.ObjectId} ): Promise<UserToBeValidateDTO>{
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] getUserToBeValidate: userId: ${JSON.stringify(userId)}`)

            const user = await this.usersRepository.findUserByObjectIdForValidating(userId);

            return UserMapper.map<UserToBeValidate, UserToBeValidateDTO>(user, UserToBeValidate, UserToBeValidateDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async findUserByEmail({email}:{email: string}): Promise<UserProfileInfoDTO>{
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] findUserByEmail: email: ${JSON.stringify(email)}`);

            const user = await this.usersRepository.findByEmail(email);

            return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addChatGroupToUser({userId,chatGroupId}:{userId:mongoose.Types.ObjectId, chatGroupId:mongoose.Types.ObjectId}): Promise<UserProfileInfoDTO>{
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] addChatGroupToUser: userId: ${JSON.stringify(userId)}, chatGroupId: ${JSON.stringify(chatGroupId)}`);

            const user = await this.usersRepository.addChatGroupToUser(userId, chatGroupId);

            return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeChatGroupFromUser({userId,chatGroupId}:{userId:mongoose.Types.ObjectId, chatGroupId:mongoose.Types.ObjectId} ): Promise<UserProfileInfoDTO>{
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] removeChatGroupFromUser: userId: ${JSON.stringify(userId)}, chatGroupId: ${JSON.stringify(chatGroupId)}`);

            const user = await this.usersRepository.removeChatGroupFromUser(userId,chatGroupId);

            return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async addFriend({userId, friendId}:{userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId}): Promise<FriendInfoDTO> {
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] addFriend: userId: ${JSON.stringify(userId)}, friendId: ${JSON.stringify(friendId)}`);

            const processedUser = await this.usersRepository.addFriend(userId, friendId);

            return UserMapper.map<ReturnUser,FriendInfoDTO>(processedUser, ReturnUser, FriendInfoDTO)
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeFriend({userId, friendId}:{userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId}): Promise<FriendInfoDTO> {
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] removeFriend: userId: ${JSON.stringify(userId)}, friendId: ${JSON.stringify(friendId)}`);

            const processedUser = await this.usersRepository.removeFriend(userId, friendId);
            
            return UserMapper.map<ReturnUser,FriendInfoDTO>(processedUser, ReturnUser, FriendInfoDTO)

        } catch (error) {
            throw new Error(error);
        }
    }
    async getFriendIdsOfUser( {userId} : {userId: mongoose.Types.ObjectId}): Promise<mongoose.Types.ObjectId[]> {
        try {
            const { logger } = this;

            logger.debug(`[UsersService] getFriendIdsOfUser: userId: ${JSON.stringify(userId)}`);

            return await this.usersRepository.getFriendsOfUser(userId);

        } catch (error) {
            throw new Error(error);
        }
    }
    async getUsersFriendsInfo({userIds}:{userIds: mongoose.Types.ObjectId[]}): Promise<FriendInfoDTO[]> {
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] getUsersFriendsInfo: userIds: ${JSON.stringify(userIds)}`);

            const users = await this.usersRepository.getUserFriends(userIds);

            const usersData = Promise.all(users.map((user)=>{
                return UserMapper.map<ReturnUser, FriendInfoDTO>(user, ReturnUser,FriendInfoDTO)
            }));

            return usersData;
        } catch (error) {
          throw new Error(error);
        }
    }
    async mapUserProfileInfo({mapUserInfoDTO}:{mapUserInfoDTO:MapUserInfoDTO}): Promise<ReturnUserProfile>{
        const {
            UserMapper,
            logger
        } = this;
        
        logger.debug(`[UsersService] mapUserProfileInfo:${JSON.stringify(mapUserInfoDTO)}`);

        return UserMapper.map<MapUserInfoDTO, ReturnUserProfile>(mapUserInfoDTO, MapUserInfoDTO, ReturnUserProfile)
        
    }

    async searchUser({searchText}:{searchText:string}) {
        return await this.usersRepository.searchUser(searchText);
    }   
}
