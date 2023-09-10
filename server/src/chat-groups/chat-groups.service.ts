import { Injectable } from '@nestjs/common';
import { CreateChatGroupDTO } from './dtos/create-chat-group.dto';
import mongoose from "mongoose";
import { User } from 'src/users/users.model';
import { ChatGroupsRepository } from './chat-groups.repository';
import { ChatGroupInfoDTO } from './dtos/chat-group-info.dto';
import { IChatGroupService } from 'interfaces/chat-groups-service.interface';
import { ReturnChatGroup } from './chat-groups.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReturnChatGroupDTO } from './dtos/return-chat-groups.dto';

@Injectable()
export class ChatGroupsService implements IChatGroupService {
    constructor(
        private chatGroupsRepository : ChatGroupsRepository,
        @InjectMapper() private readonly ChatGroupMapper: Mapper){}

    async createChatGroup({createChatGroupDTO}:{createChatGroupDTO:CreateChatGroupDTO}): Promise<ReturnChatGroupDTO>{
        try {
            const {ChatGroupMapper} = this;
            const newChatGroup: ReturnChatGroup =  await this.chatGroupsRepository.createChatGroup({createChatGroupDTO});
            return ChatGroupMapper.map<ReturnChatGroup, ReturnChatGroupDTO>(newChatGroup,ReturnChatGroup,ReturnChatGroupDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteChatGroup({chatGroupId}:{chatGroupId: mongoose.Types.ObjectId}): Promise<ReturnChatGroupDTO>{
        try {
            const {ChatGroupMapper} = this;
            const chatGroup = await this.chatGroupsRepository.deleteChatGroup({chatGroupId: chatGroupId});
            return ChatGroupMapper.map<ReturnChatGroup, ReturnChatGroupDTO>(chatGroup,ReturnChatGroup,ReturnChatGroupDTO);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getChatGroup({id}:{id: mongoose.Types.ObjectId}): Promise<ChatGroupInfoDTO>{
        try {
            const {ChatGroupMapper} = this;
            const chatGroup = await this.chatGroupsRepository.getChatGroupByObjectId({id:id});
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(chatGroup,ReturnChatGroup,ChatGroupInfoDTO);
        } catch (error) {
            throw new Error(error.message);
        }
    }async getChatGroupByStringId({id}:{id: string}): Promise<ChatGroupInfoDTO>{
        try {
            const {ChatGroupMapper} = this;
            const chatGroup = await this.chatGroupsRepository.getChatGroupByStringId({id:id});
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(chatGroup,ReturnChatGroup,ChatGroupInfoDTO);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupDetails({chatGroups} : {chatGroups: mongoose.Types.ObjectId[]} ): Promise<ChatGroupInfoDTO[]>{
        try {
            const chatGroupDetails = await Promise.all(chatGroups.map( async (chatGroupId)=>{
                return await this.getChatGroup({id :chatGroupId});
            }));
            return chatGroupDetails;
        } catch (error) {
            throw new Error(error);
        }
    }
    async getChatGroupsUsers({chatGroupId}:{chatGroupId:mongoose.Types.ObjectId}):Promise<mongoose.Types.ObjectId[]>{
        try {
            return await this.chatGroupsRepository.getChatGroupsUsers(chatGroupId);
          } catch (error) {
            throw new Error(error.message);
          }
    }
    async addUserToChatGroup( {chatGroupId,userId}:{chatGroupId:mongoose.Types.ObjectId, userId:mongoose.Types.ObjectId} ): Promise<ChatGroupInfoDTO>{
        try {
            const {ChatGroupMapper} = this;
            const processedChatGroup = await this.chatGroupsRepository.addUserToChatGroup(chatGroupId, userId);
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async removeUserFromChatGroup({chatGroupId,userId}:{chatGroupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId}): Promise<ChatGroupInfoDTO>{
        try {
            const {ChatGroupMapper} = this;
            const processedChatGroup =  await this.chatGroupsRepository.removeUserFromChatGroup(chatGroupId, userId);
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);
        } catch (error) {
            throw new Error(error);
        }   
    }
    async updateChatGroupName({chatGroupId, chatGroupName}:{chatGroupId: mongoose.Types.ObjectId, chatGroupName: string}):Promise<ChatGroupInfoDTO> {
        try {
            const {ChatGroupMapper} = this;
            const processedChatGroup = await this.chatGroupsRepository.updateChatGroupName(chatGroupId, chatGroupName);
            return ChatGroupMapper.map<ReturnChatGroup, ChatGroupInfoDTO>(processedChatGroup, ReturnChatGroup, ChatGroupInfoDTO);
        } catch (error) {
          throw new Error(error);
        }
    }
      
}
