import { Injectable, Logger } from '@nestjs/common';
import mongoose from "mongoose";
import { ChatGroupsRepository } from './chat-groups.repository';
import { IChatGroupService } from 'interfaces/chat-groups-service.interface';
import { ReturnChatGroup } from './chat-groups.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { 
    ReturnChatGroupDTO, 
    CreateChatGroupDTO,
    ChatGroupInfoDTO, 
    UpdateChatGroupsNameDTO} from './dtos/chat-group-dtos';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UtilsService } from 'src/utils/utils.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AddedToChatGroupNotificationDto, NotificationDto } from '../notifications/dto/create-notification.dto';

@Injectable()
export class ChatGroupsService implements IChatGroupService {
    private readonly logger = new Logger(ChatGroupsService.name);
    constructor(
        private chatGroupsRepository : ChatGroupsRepository,
        private notificationsService : NotificationsService, 
        private utilsService : UtilsService,
        private readonly eventEmmitter: EventEmitter2,
        @InjectMapper() private readonly ChatGroupMapper: Mapper){}

    async createChatGroup({
        createChatGroupDTO
    }:{
        createChatGroupDTO:CreateChatGroupDTO
    }): Promise<ReturnChatGroupDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] createChatGroup: ${JSON.stringify(createChatGroupDTO)}`);

            const newChatGroup: ReturnChatGroup =  await this.chatGroupsRepository.createChatGroup({createChatGroupDTO});

            return ChatGroupMapper.map<ReturnChatGroup, ReturnChatGroupDTO>(newChatGroup,ReturnChatGroup,ReturnChatGroupDTO);

        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteChatGroup({
        chatGroupId
    }:{
        chatGroupId: mongoose.Types.ObjectId
    }): Promise<ReturnChatGroupDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] deleteChatGroup: chatGroupId: ${JSON.stringify(chatGroupId)}`);

            const chatGroup = await this.chatGroupsRepository.deleteChatGroup({chatGroupId: chatGroupId});

            return ChatGroupMapper.map<ReturnChatGroup, ReturnChatGroupDTO>(chatGroup,ReturnChatGroup,ReturnChatGroupDTO);

        } catch (error) {
            throw new Error(error);
        }
    }

    async getChatGroup({
        chatGroupId
    }:{
        chatGroupId: mongoose.Types.ObjectId
    }): Promise<ChatGroupInfoDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] getChatGroup: chatGroupId: ${JSON.stringify(chatGroupId)}`);

            const chatGroup = await this.chatGroupsRepository.getChatGroupByObjectId({id:chatGroupId});

            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(chatGroup,ReturnChatGroup,ChatGroupInfoDTO);

        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async getChatGroupByStringId({
        chatGroupId
    }:{
        chatGroupId: string
    }): Promise<ChatGroupInfoDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] getChatGroupByStringId: chatGroupId: ${JSON.stringify(chatGroupId)}`);

            const chatGroup = await this.chatGroupsRepository.getChatGroupByStringId({id:chatGroupId});
            
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(chatGroup,ReturnChatGroup,ChatGroupInfoDTO);

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getChatGroupDetails({
        chatGroups
    } : {
        chatGroups: mongoose.Types.ObjectId[]
    } ): Promise<ChatGroupInfoDTO[]> {
        try {
            const{ logger } = this;

            logger.debug(`[ChatGroupsService] getChatGroupDetails: chatGroups: ${JSON.stringify(chatGroups)}`);

            const chatGroupDetails = await Promise.all(chatGroups.map( async (chatGroupId)=>{

                return await this.getChatGroup({chatGroupId :chatGroupId});
            }));

            return chatGroupDetails;

        } catch (error) {
            throw new Error(error);
        }
    }

    async getChatGroupsUsers({
        chatGroupId
    }:{
        chatGroupId:mongoose.Types.ObjectId
    }):Promise<mongoose.Types.ObjectId[]> {
        try {
            const { logger } = this;

            logger.debug(`[ChatGroupsService] getChatGroupsUsers: chatGroupId: ${JSON.stringify(chatGroupId)}`);
            
            return await this.chatGroupsRepository.getChatGroupsUsers(chatGroupId);

          } catch (error) {
            throw new Error(error.message);
          }
    }

    async addUserToChatGroup({
        chatGroupId,
        userId
    }:{
        chatGroupId:mongoose.Types.ObjectId, 
        userId:mongoose.Types.ObjectId
    }): Promise<ChatGroupInfoDTO> {
        try {
            const {
                utilsService,
                ChatGroupMapper,
                logger,
                eventEmmitter
            } = this;

            logger.debug(`[ChatGroupsService] addUserToChatGroup: ${JSON.stringify({chatGroupId,userId})}`);

            const processedChatGroup = await this.chatGroupsRepository.addUserToChatGroup(chatGroupId, userId);

            eventEmmitter.emit('addedToChatGroupNotification',{
                    UserToBeAdded: userId.toString(),
                    AddedToChatGroupName: processedChatGroup.chatGroupName,
                    AddedByFriendName: 'example name',
                    AddedTime: utilsService.getCurrentDate()
            });

            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);

        } catch (error) {
            throw new Error(error.message);
        }
    }
    @OnEvent('addedToChatGroupNotification')
    async createAddingUserToChatGroupNotification(
        addedToChatGroupNotificationDto:AddedToChatGroupNotificationDto
    ): Promise<NotificationDto>{
        
        const { 
            notificationsService,
            logger } = this;
        
            const notification = await notificationsService.createAddedToChatGroupNotification({addedToChatGroupNotificationDto});

            logger.debug(`[ChatGroupsService] createAddingUserToChatGroupNotification: ${addedToChatGroupNotificationDto}`);
            
            return notification;
    }
    async removeUserFromChatGroup({
        chatGroupId,
        userId
    }:{
        chatGroupId: mongoose.Types.ObjectId, 
        userId: mongoose.Types.ObjectId
    }): Promise<ChatGroupInfoDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] removeUserFromChatGroup: ${JSON.stringify({chatGroupId,userId})}`);

            const processedChatGroup =  await this.chatGroupsRepository.removeUserFromChatGroup(chatGroupId, userId);
            
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);
            
        } catch (error) {
            throw new Error(error);
        }   
    }

    async updateChatGroupName({
        updateChatGroupsNameDto
    }:{
        updateChatGroupsNameDto:UpdateChatGroupsNameDTO
    }):Promise<ChatGroupInfoDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] updateChatGroupName: ${JSON.stringify(updateChatGroupsNameDto)}`);

            const {chatGroupId, chatGroupName} = updateChatGroupsNameDto; 
            const processedChatGroup = await this.chatGroupsRepository.updateChatGroupName(chatGroupId, chatGroupName);

            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);

        } catch (error) {
          throw new Error(error);
        }
    }
      
}
