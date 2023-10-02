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
import { ChatGroupNotFoundException, ChatGroupsNotFoundException, ChatGroupsUsersNotFoundException, CouldNotAddedUserToChatGroupException, CouldNotRemovedUserFromChatGroupException, CouldNotUpdatedChatGroupNameException } from './exceptions';

@Injectable()
export class ChatGroupsService implements IChatGroupService {
    private readonly logger = new Logger(ChatGroupsService.name);
    constructor(
        private chatGroupsRepository : ChatGroupsRepository,
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
        chatGroupId: string
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
        chatGroupId: string
    }): Promise<ChatGroupInfoDTO> {

        const {
            ChatGroupMapper,
            logger
        } = this;

        logger.debug(`[ChatGroupsService] getChatGroup: chatGroupId: ${JSON.stringify(chatGroupId)}`);

        const chatGroup = await this.chatGroupsRepository.getChatGroupByObjectId({id:chatGroupId});

        if(!chatGroup) {
            throw new ChatGroupNotFoundException({chatGroupId});
        }
        return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(chatGroup,ReturnChatGroup,ChatGroupInfoDTO);

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
            
            if(!chatGroup) {
                throw new ChatGroupNotFoundException({chatGroupId});
            }

            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(chatGroup,ReturnChatGroup,ChatGroupInfoDTO);

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getChatGroupDetails({
        chatGroups
    } : {
        chatGroups: string[]
    } ): Promise<ChatGroupInfoDTO[]> {
        const{ logger } = this;

        logger.debug(`[ChatGroupsService] getChatGroupDetails: chatGroups: ${JSON.stringify(chatGroups)}`);

        const chatGroupDetails = await Promise.all(chatGroups.map( async (chatGroupId)=>{

            const chatGroup = await this.getChatGroup({chatGroupId :chatGroupId});
            if(!chatGroup){
                throw new ChatGroupNotFoundException({chatGroup});
            }
            return chatGroup;
        }));

        if(!chatGroupDetails) {
            throw new ChatGroupsNotFoundException({chatGroups});
        }
        return chatGroupDetails;
    }

    async getChatGroupsUsers({
        chatGroupId
    }:{
        chatGroupId:string
    }):Promise<string[]> {
        try {
            const { logger } = this;

            logger.debug(`[ChatGroupsService] getChatGroupsUsers: chatGroupId: ${JSON.stringify(chatGroupId)}`);
            
            const users =  await this.chatGroupsRepository.getChatGroupsUsers(chatGroupId);

            if(!users){
                throw new ChatGroupsUsersNotFoundException({chatGroupId});
            }
            return users;

          } catch (error) {
            throw new Error(error.message);
          }
    }

    async addUserToChatGroup({
        chatGroupId,
        userId
    }:{
        chatGroupId:string, 
        userId:string
    }): Promise<ChatGroupInfoDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] addUserToChatGroup: ${JSON.stringify({chatGroupId,userId})}`);

            const processedChatGroup = await this.chatGroupsRepository.addUserToChatGroup(chatGroupId, userId);

            if(processedChatGroup.errors) {
                throw new CouldNotAddedUserToChatGroupException({chatGroupId, userId});
            }

            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);

        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async removeUserFromChatGroup({
        chatGroupId,
        userId
    }:{
        chatGroupId: string, 
        userId: string
    }): Promise<ChatGroupInfoDTO> {
        try {
            const {
                ChatGroupMapper,
                logger
            } = this;

            logger.debug(`[ChatGroupsService] removeUserFromChatGroup: ${JSON.stringify({chatGroupId,userId})}`);

            const processedChatGroup =  await this.chatGroupsRepository.removeUserFromChatGroup(chatGroupId, userId);
            
            if(processedChatGroup.errors){
                throw new CouldNotRemovedUserFromChatGroupException({chatGroupId, userId});
            }
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

            if(processedChatGroup.chatGroupName !== chatGroupName) {
                throw new CouldNotUpdatedChatGroupNameException({chatGroupName});
            }

            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);

        } catch (error) {
          throw new Error(error);
        }
    }
      
}
