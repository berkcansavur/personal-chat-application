import { Injectable, Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { UsersRepository } from './users.repository';
import { IUsersService } from 'interfaces/user-service.interface';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AuthenticatedUserDTO, MapUserInfoDTO } from './dtos/user-dtos';
import { 
    ReturnUser, 
    ReturnUserProfile, 
    ReturnUserToBeAuth, 
    User, 
    UserToBeValidate } from './users.model';
import { 
    UserToBeValidateDTO, 
    UserProfileInfoDTO,
    ReturnUserDTO,
    FriendInfoDTO,
    CreateUserDTO } from './dtos/user-dtos';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AddFriendNotificationDto, NotificationDto, RemoveFriendNotificationDto } from '../notifications/dto/create-notification.dto';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class UsersService implements IUsersService {
    private readonly logger = new Logger(UsersService.name);
    
    constructor( 
        private usersRepository: UsersRepository,
        @InjectMapper() private readonly UserMapper: Mapper,
        private readonly eventEmmitter: EventEmitter2,
        private notificationService: NotificationsService,
        private utilsService : UtilsService
        ){}
        
    async createUser({
        createUserDTO
    }:{
        createUserDTO: CreateUserDTO
    }): Promise<ReturnUserDTO> {

        const {
            UserMapper,
            logger,
            eventEmmitter
        } = this;
        
        logger.debug(`[UsersService] createUser: ${JSON.stringify(createUserDTO)}`);

        const newUser : ReturnUser = await this.usersRepository.createUser({createUserDTO});

        return UserMapper.map< ReturnUser, ReturnUserDTO>(newUser,ReturnUser,ReturnUserDTO);
    }
    
      
    async findUser({
        userId
    }:{
        userId: string
    }): Promise<UserProfileInfoDTO> {
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

    async getUserToBeValidate({
        userId
    }:{
        userId: string
    } ): Promise<UserToBeValidateDTO> {
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

    async findUserByEmail({
        email
    }:{
        email: string
    }): Promise<UserProfileInfoDTO> {
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

    async addChatGroupToUser({
        userId,
        chatGroupId
    }:{
        userId:string,
        chatGroupId:string
    }): Promise<UserProfileInfoDTO> {
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

    async removeChatGroupFromUser({
        userId,
        chatGroupId
    }:{
        userId:string, 
        chatGroupId:string
    }): Promise<UserProfileInfoDTO> {
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
    async addFriend({
        userId, 
        friendId
    }:{
        userId: string, 
        friendId: string
    }): Promise<FriendInfoDTO> {
        try {
            const {
                UserMapper,
                logger,
                eventEmmitter,
                utilsService
            } = this;
            
            logger.debug(`[UsersService] addFriend: userId: ${JSON.stringify(userId)}, friendId: ${JSON.stringify(friendId)}`);
            
            const processedUser = await this.usersRepository.addFriend(userId, friendId);

            eventEmmitter.emit('addFriendNotification', {
                AddedByFriendName:processedUser.name,
                UserToBeAdded:userId.toString(),
                AddedTime:utilsService.getCurrentDate()
            });

            return UserMapper.map<ReturnUser,FriendInfoDTO>(processedUser, ReturnUser, FriendInfoDTO)
        } catch (error) {
            throw new Error(error);
        }
    }
    @OnEvent('addFriendNotification')
    async createAddingUserNotification(
        addFriendNotificationDto: AddFriendNotificationDto
    ): Promise<NotificationDto>{
        const { 
            notificationService,
            logger } = this;
        
        const notification = await notificationService.createAddedByFriendNotification({addFriendNotificationDto})
        
        logger.debug(`[UsersService] addFriendNotification: DTO: ${JSON.stringify(addFriendNotificationDto)}, notification: ${JSON.stringify(notification)}`);

        return notification;
    }
    async removeFriend({
        userId, 
        friendId
    }:{
        userId:string, 
        friendId:string
    }): Promise<FriendInfoDTO> {
        try {
            const {
                UserMapper,
                logger,
                eventEmmitter,
                utilsService
            } = this;

            logger.debug(`[UsersService] removeFriend: userId: ${JSON.stringify(userId)}, friendId: ${JSON.stringify(friendId)}`);

            const processedUser = await this.usersRepository.removeFriend(userId, friendId);

            eventEmmitter.emit('removeFriendNotification', {
                RemovedByFriendName:processedUser.name,
                UserToBeRemoved:userId.toString(),
                RemovedTime:utilsService.getCurrentDate()
            });
            
            return UserMapper.map<ReturnUser,FriendInfoDTO>(processedUser, ReturnUser, FriendInfoDTO)

        } catch (error) {
            throw new Error(error);
        }
    }

    @OnEvent('removeFriendNotification')
    async createRemovingUserNotification(
        removeFriendNotificationDto: RemoveFriendNotificationDto
    ): Promise<NotificationDto>{
        const { 
            notificationService,
            logger } = this;
        
        const notification = await notificationService.createRemovedByFriendNotification({removeFriendNotificationDto})
        
        logger.debug(`[UsersService] removeFriendNotification: DTO: ${JSON.stringify(removeFriendNotificationDto)}, notification: ${JSON.stringify(notification)}`);

        return notification;
    }
    async getFriendIdsOfUser({
        userId
    } : {
        userId: string
    }): Promise<string[]> {
        try {
            const { logger } = this;

            logger.debug(`[UsersService] getFriendIdsOfUser: userId: ${JSON.stringify(userId)}`);

            return await this.usersRepository.getFriendIdsOfUser(userId);

        } catch (error) {
            throw new Error(error);
        }
    }
    async getUsersFriendsInfo({
        userIds
    }:{
        userIds: string[]
    }): Promise<FriendInfoDTO[]> {
        try {
            const {
                UserMapper,
                logger
            } = this;

            logger.debug(`[UsersService] getUsersFriendsInfo: userIds: ${JSON.stringify(userIds)}`);

            const users = await this.usersRepository.getUserFriends(userIds);

            const usersData = users.map((user)=>{
                return UserMapper.map<ReturnUser, FriendInfoDTO>(user, ReturnUser,FriendInfoDTO)
            });

            return usersData;
        } catch (error) {
          throw new Error(error);
        }
    }
    async mapUserProfileInfo({
        mapUserInfoDTO
    }:{
        mapUserInfoDTO:MapUserInfoDTO
    }): Promise<ReturnUserProfile> {
        const {
            UserMapper,
            logger
        } = this;
        
        logger.debug(`[UsersService] mapUserProfileInfo:${JSON.stringify(mapUserInfoDTO)}`);

        return UserMapper.map<MapUserInfoDTO, ReturnUserProfile>(mapUserInfoDTO, MapUserInfoDTO, ReturnUserProfile)
        
    }
    async setUsersAccessToken({
        authenticatedUserDto
    }:{
        authenticatedUserDto : AuthenticatedUserDTO
    }): Promise<AuthenticatedUserDTO> {

        const {
            UserMapper,
            logger
        } = this;
        logger.debug(`[UsersService] setUsersAccessToken: ${JSON.stringify(authenticatedUserDto)}`);

        const {userId, access_token} = authenticatedUserDto;

        const updatedUser = await this.usersRepository.setUsersAccessToken(userId, access_token)

        return UserMapper.map<ReturnUserToBeAuth, AuthenticatedUserDTO>(updatedUser, ReturnUserToBeAuth, AuthenticatedUserDTO);
    }

    async getAccessToken({
        userId
    }:{
        userId : string
    }): Promise<AuthenticatedUserDTO> {

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] getAccessToken: ${JSON.stringify(userId)}`);

        const updatedUser = await this.usersRepository.getUsersAccessToken(userId);
        
        const map = UserMapper.map<ReturnUserToBeAuth, AuthenticatedUserDTO>(updatedUser, ReturnUserToBeAuth, AuthenticatedUserDTO);
        logger.debug(`[UsersService] getAccessToken: data: ${JSON.stringify(map)}`);
        return map;
    }

    async removeUsersAccessToken({
        userId
    }:{
        userId : string
    }): Promise<AuthenticatedUserDTO> {

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] removeUsersAccessToken: ${JSON.stringify(userId)}`);

        const user = await this.usersRepository.setUsersAccessToken(userId,null);
        
        return UserMapper.map<ReturnUserToBeAuth, AuthenticatedUserDTO>(user, ReturnUserToBeAuth, AuthenticatedUserDTO);
    }
    async searchUser({
        searchText
    }:{
        searchText:string
    }): Promise< ReturnUserDTO[] | null> {
        return await this.usersRepository.searchUser(searchText);
    }   
}
