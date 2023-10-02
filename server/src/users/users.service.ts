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
import { EmailIsNotExistException, FriendCouldNotAddedException, FriendCouldNotRemovedException, UserAccessTokenCouldNotAssigned, UserAccessTokenCouldNotRemoved, UserAccessTokenCouldNotRetrieved, UserCouldNotAddedToChatGroupException, UserCouldNotCreatedException, UserCouldNotRemovedFromChatGroupException, UserNotFoundException, UsersNotFoundException } from './exceptions';

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
        
        if(!newUser){
            throw new UserCouldNotCreatedException({createUserDTO});
        }
        
        return UserMapper.map< ReturnUser, ReturnUserDTO>(newUser,ReturnUser,ReturnUserDTO);

    }
    
      
    async findUser({
        userId
    }:{
        userId: string
    }): Promise<UserProfileInfoDTO> {

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] findUser: userId: ${JSON.stringify(userId)}`);

        const user = await this.usersRepository.findUserByObjectId(userId);
        
        if(!user){
            throw new UserNotFoundException({userId});
        }

        return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);

    }

    async getUserToBeValidate({
        userId
    }:{
        userId: string
    } ): Promise<UserToBeValidateDTO> {

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] getUserToBeValidate: userId: ${JSON.stringify(userId)}`)

        const user = await this.usersRepository.findUserByObjectIdForValidating(userId);
        
        if(!user) {
            throw new UserNotFoundException({userId});
        }

        return UserMapper.map<UserToBeValidate, UserToBeValidateDTO>(user, UserToBeValidate, UserToBeValidateDTO);

    }

    async findUserByEmail({
        email
    }:{
        email: string
    }): Promise<UserProfileInfoDTO> {
        
        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] findUserByEmail: email: ${JSON.stringify(email)}`);

        const user = await this.usersRepository.findByEmail(email);
        
        if(!user) {
            throw new EmailIsNotExistException({email});
        }

        return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);

    }

    async addChatGroupToUser({
        userId,
        chatGroupId
    }:{
        userId:string,
        chatGroupId:string
    }): Promise<UserProfileInfoDTO> {

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] addChatGroupToUser: userId: ${JSON.stringify(userId)}, chatGroupId: ${JSON.stringify(chatGroupId)}`);

        const user = await this.usersRepository.addChatGroupToUser(userId, chatGroupId);
        
        if(!user) {
            throw new UserCouldNotAddedToChatGroupException({userId, chatGroupId});
        }
        
        return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);

    }

    async removeChatGroupFromUser({
        userId,
        chatGroupId
    }:{
        userId:string, 
        chatGroupId:string
    }): Promise<UserProfileInfoDTO> {

        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] removeChatGroupFromUser: userId: ${JSON.stringify(userId)}, chatGroupId: ${JSON.stringify(chatGroupId)}`);

        const user = await this.usersRepository.removeChatGroupFromUser(userId,chatGroupId);

        if(!user) {
            throw new UserCouldNotRemovedFromChatGroupException({userId,chatGroupId});
        }
        
        return UserMapper.map<ReturnUser, UserProfileInfoDTO>(user, ReturnUser, UserProfileInfoDTO);

    }
    async addFriend({
        userId, 
        friendId
    }:{
        userId: string, 
        friendId: string
    }): Promise<FriendInfoDTO> {

            const {
                UserMapper,
                logger,
                eventEmmitter,
                utilsService
            } = this;
            
            logger.debug(`[UsersService] addFriend: userId: ${JSON.stringify(userId)}, friendId: ${JSON.stringify(friendId)}`);
            
            const processedUser = await this.usersRepository.addFriend(userId, friendId);

            if(!processedUser) {
                throw new FriendCouldNotAddedException({userId, friendId});
            }

            eventEmmitter.emit('addFriendNotification', {
                AddedByFriendName:processedUser.name,
                UserToBeAdded:userId.toString(),
                AddedTime:utilsService.getCurrentDate()
            });

            return UserMapper.map<ReturnUser,FriendInfoDTO>(processedUser, ReturnUser, FriendInfoDTO)

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

        const {
            UserMapper,
            logger,
            eventEmmitter,
            utilsService
        } = this;

        logger.debug(`[UsersService] removeFriend: userId: ${JSON.stringify(userId)}, friendId: ${JSON.stringify(friendId)}`);

        const processedUser = await this.usersRepository.removeFriend(userId, friendId);

        if(!processedUser) {
            throw new FriendCouldNotRemovedException({userId, friendId});
        }
        eventEmmitter.emit('removeFriendNotification', {
            RemovedByFriendName:processedUser.name,
            UserToBeRemoved:userId.toString(),
            RemovedTime:utilsService.getCurrentDate()
        });
        
        return UserMapper.map<ReturnUser,FriendInfoDTO>(processedUser, ReturnUser, FriendInfoDTO);

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
        
        const { logger } = this;

        logger.debug(`[UsersService] getFriendIdsOfUser: userId: ${JSON.stringify(userId)}`);

        const userIds = await this.usersRepository.getFriendIdsOfUser(userId);
            
        if(!userIds){
            throw new UserNotFoundException({userIds});
        }

        return userIds;

    }
    async getUsersFriendsInfo({
        userIds
    }:{
        userIds: string[]
    }): Promise<FriendInfoDTO[]> {
        
        const {
            UserMapper,
            logger
        } = this;

        logger.debug(`[UsersService] getUsersFriendsInfo: userIds: ${JSON.stringify(userIds)}`);

        const users = await this.usersRepository.getUserFriends(userIds);

        const usersData = users.map((user)=>{
            if(!user) {
                throw new UserNotFoundException({user});
            }
            return UserMapper.map<ReturnUser, FriendInfoDTO>(user, ReturnUser,FriendInfoDTO)
        });
        if(!usersData){
            throw new UsersNotFoundException({userIds})
        }
        return usersData;

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

        const updatedUser = await this.usersRepository.setUsersAccessToken(userId, access_token);

        if(!updatedUser) {
            throw new UserAccessTokenCouldNotAssigned({authenticatedUserDto});
        }

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

        if(updatedUser.accessToken.length < 5) {
            throw new UserAccessTokenCouldNotRetrieved({userId});
        }
        
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

        if(user.accessToken.length > 5) {
            throw new UserAccessTokenCouldNotRemoved({userId});
        }
        
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
