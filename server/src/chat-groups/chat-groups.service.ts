import { Injectable } from '@nestjs/common';
import { ChatGroups } from './chat-groups.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatGroupDTO } from './dtos/create-chat-group.dto';
import mongoose from "mongoose";
import { User } from 'src/users/users.model';
@Injectable()
export class ChatGroupsService {
    constructor(
        @InjectModel('ChatGroups') private ChatGroupsModel: Model<ChatGroups>){}


    async createChatGroup(chatGroup: CreateChatGroupDTO, creatorUser){
        const users = chatGroup.users || [];
        users.push(creatorUser);

        const chatGroupName = chatGroup.chatGroupName;
        const creatingDate = Date.now();
        
        const newChatGroup = new this.ChatGroupsModel({users,chatGroupName,creatingDate});
        return await newChatGroup.save();
    }
    async deleteChatGroup(chatGroupId: mongoose.Types.ObjectId){
        await this.ChatGroupsModel.findByIdAndRemove(chatGroupId);
    }
    async getChatGroupById(chatGroupId:string){
        try {
            if(!chatGroupId){return null;}
            return this.ChatGroupsModel.findById(chatGroupId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupByObjectId(id:object){
        try {
            if(!id){return null;}
            return await this.ChatGroupsModel.findById(id);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupsUsers(id:mongoose.Types.ObjectId){
        try {
            const chatGroup = await this.ChatGroupsModel.findById(id);
            if (!chatGroup) {
              throw new Error('Chat group not found');
            }
            const users:object[] = chatGroup.users.map((user)=>user);
            return users;
          } catch (error) {
            throw new Error(error.message);
          }
    }
    async getChatGroupsUsersById(id: string){
        try {
            const chatGroup = await this.ChatGroupsModel.findById(id);
            if (!chatGroup) {
              throw new Error('Chat group not found');
            }
            const users: object[] = chatGroup.users.map((user)=>user);
            return users;
          } catch (error) {
            throw new Error(error.message);
          }
    }
    async addUserToChatGroup(chatGroupId:string, user:User){
        try {

            const chatGroup = await this.ChatGroupsModel.findById(chatGroupId);
            const cgUsers = await this.getChatGroupsUsers(chatGroup._id);
            const updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(
                chatGroupId,
                {$push:{users:user}},
                {new:true}
            );
            await updatedChatGroup.save();
            return updatedChatGroup;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async removeUserFromChatGroup(chatGroupId: string, userId: string){
        try {
            const updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(
                chatGroupId,
                { $pull: { users: { _id: userId } } },
                { new: true } 
            );            
            await updatedChatGroup.save();
            return updatedChatGroup;
        } catch (error) {
            throw new Error(error);
        }   
    }
    async updateChatGroupName(chatGroupId: string, chatGroupName: string) {
        try {
          let updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            { chatGroupName: chatGroupName},
            { new: true }
          );
          return updatedChatGroup;
        } catch (error) {
          throw new Error(error);
        }
      }
      
}
