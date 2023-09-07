import { Injectable } from '@nestjs/common';
import { CreateChatGroupDTO } from './dtos/create-chat-group.dto';
import mongoose from "mongoose";
import { User } from 'src/users/users.model';
import { ChatGroupsRepository } from './chat-groups.repository';
import { ChatGroupInfoDTO } from './dtos/chat-group-info.dto';
import { IChatGroupService } from 'interfaces/chat-groups-service.interface';

@Injectable()
export class ChatGroupsService implements IChatGroupService {
    constructor(
        private chatGroupsRepository : ChatGroupsRepository){}

    async createChatGroup({chatGroup,creatorUser}:{chatGroup: CreateChatGroupDTO, creatorUser:any}){
        try {
            const createdChatGroup =  await this.chatGroupsRepository.createChatGroup(chatGroup, creatorUser);
            const chatGroupInfo = new ChatGroupInfoDTO();
            chatGroupInfo._id = createdChatGroup._id;
            chatGroupInfo.chatGroupName = createdChatGroup.chatGroupName;
            chatGroupInfo.users = createdChatGroup.users;
            return chatGroupInfo;

        } catch (error) {
            throw new Error(error);
        }
    }
    async deleteChatGroup({chatGroupId}:{chatGroupId: mongoose.Types.ObjectId}){
        try {
            await this.chatGroupsRepository.deleteChatGroup(chatGroupId);
        } catch (error) {
            throw new Error(error);
        }
    }
    async getChatGroup({id}:{id: mongoose.Types.ObjectId}){
        try {
            if(!id){return null;}

            const chatGroup = await this.chatGroupsRepository.getChatGroupByObjectId(id);
            const chatGroupInfo = new ChatGroupInfoDTO();
            chatGroupInfo._id = chatGroup._id;
            chatGroupInfo.chatGroupName = chatGroup.chatGroupName;
            chatGroupInfo.users = chatGroup.users;
            return chatGroupInfo;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupDetails({chatGroups} : {chatGroups: mongoose.Types.ObjectId[]} ){
        try {

            const chatGroupDetails = await Promise.all(chatGroups.map( async (chatGroupId)=>{
                const chatGroup = await this.getChatGroup({id :chatGroupId});
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
    async getChatGroupsUsers({chatGroupId}:{chatGroupId:mongoose.Types.ObjectId}){
        try {
            return await this.chatGroupsRepository.getChatGroupsUsers(chatGroupId);
          } catch (error) {
            throw new Error(error.message);
          }
    }
    async addUserToChatGroup( {chatGroupId,user}:{chatGroupId:mongoose.Types.ObjectId, user:User} ){
        try {
            const processedChatGroup = await this.chatGroupsRepository.addUserToChatGroup(chatGroupId, user);
            const chatGroupDTO = new ChatGroupInfoDTO();
            chatGroupDTO._id = processedChatGroup._id;
            chatGroupDTO.chatGroupName = processedChatGroup.chatGroupName;
            chatGroupDTO.users = processedChatGroup.users;
            return chatGroupDTO;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async removeUserFromChatGroup({chatGroupId,userId}:{chatGroupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId}){
        try {
            const processedChatGroup =  await this.chatGroupsRepository.removeUserFromChatGroup(chatGroupId, userId);
            const chatGroupDTO = new ChatGroupInfoDTO();
            chatGroupDTO._id = processedChatGroup._id;
            chatGroupDTO.chatGroupName = processedChatGroup.chatGroupName;
            chatGroupDTO.users = processedChatGroup.users;
            return chatGroupDTO;
        } catch (error) {
            throw new Error(error);
        }   
    }
    async updateChatGroupName({chatGroupId, chatGroupName}:{chatGroupId: mongoose.Types.ObjectId, chatGroupName: string}) {
        try {
          return await this.chatGroupsRepository.updateChatGroupName(chatGroupId, chatGroupName);
        } catch (error) {
          throw new Error(error);
        }
    }
      
}
