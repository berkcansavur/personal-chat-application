import { Injectable } from '@nestjs/common';
import { CreateChatGroupDTO } from './dtos/create-chat-group.dto';
import mongoose from "mongoose";
import { User } from 'src/users/users.model';
import { ChatGroupsRepository } from './chat-groups.repository';
import { ChatGroupInfoDTO } from './dtos/chat-group-info.dto';

@Injectable()
export class ChatGroupsService {
    constructor(
        private chatGroupsRepository : ChatGroupsRepository){}

    async createChatGroup(chatGroup: CreateChatGroupDTO, creatorUser){
        try {
            return await this.chatGroupsRepository.createChatGroup(chatGroup, creatorUser);
        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteChatGroup(chatGroupId: mongoose.Types.ObjectId){
        try {
            await this.chatGroupsRepository.deleteChatGroup(chatGroupId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getChatGroup(id: mongoose.Types.ObjectId){
        try {
            if(!id){return null;}
            return await this.chatGroupsRepository.getChatGroupByObjectId(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupDetails( chatGroups: mongoose.Types.ObjectId[] ){
        try {

            const chatGroupDetails = await Promise.all(chatGroups.map( async (chatGroupId)=>{
                const chatGroup = await this.getChatGroup(chatGroupId);
                const chatGroupInfoDTO = new ChatGroupInfoDTO();
                chatGroupInfoDTO._id = chatGroup._id;
                chatGroupInfoDTO.chatGroupName = chatGroup.chatGroupName;
                return chatGroupInfoDTO;
            }));
            return chatGroupDetails;
        } catch (error) {
            throw new Error(error);
        }
    }
    async getChatGroupsUsers(chatGroupId:mongoose.Types.ObjectId){
        try {
            return await this.chatGroupsRepository.getChatGroupsUsers(chatGroupId);
          } catch (error) {
            throw new Error(error.message);
          }
    }
    async addUserToChatGroup(chatGroupId:mongoose.Types.ObjectId, user:User){
        try {
            return await this.chatGroupsRepository.addUserToChatGroup(chatGroupId, user);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async removeUserFromChatGroup(chatGroupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId){
        try {
            return await this.chatGroupsRepository.removeUserFromChatGroup(chatGroupId, userId);
        } catch (error) {
            throw new Error(error);
        }   
    }
    async updateChatGroupName(chatGroupId: mongoose.Types.ObjectId, chatGroupName: string) {
        try {
          return await this.chatGroupsRepository.updateChatGroupName(chatGroupId, chatGroupName);
        } catch (error) {
          throw new Error(error);
        }
    }
      
}
