import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CreateChatGroupDTO } from "./dtos/create-chat-group.dto";
import { ChatGroups } from "./chat-groups.model";
import { User } from 'src/users/users.model';

@Injectable()
export class ChatGroupsRepository {
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
    async getChatGroupByObjectId(id:mongoose.Types.ObjectId){
        return await this.ChatGroupsModel.findById(id);
    }
    async getChatGroupsUsers(id:mongoose.Types.ObjectId){
        const chatGroup = await this.ChatGroupsModel.findById(id);
        if (!chatGroup) {
            throw new Error('Chat group not found');
        }
        const users: object[] = chatGroup.users.map((user)=>user);
        return users;
    }
    async addUserToChatGroup(chatGroupId: mongoose.Types.ObjectId, user: User){
        const updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            {$push:{users:user}},
            {new:true}
        );
        await updatedChatGroup.save();
        return updatedChatGroup;
    }
    async removeUserFromChatGroup(chatGroupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId){
        const updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            { $pull: { users: { _id: userId } } },
            { new: true } 
        );            
        await updatedChatGroup.save();
        return updatedChatGroup;  
    }
    async updateChatGroupName(chatGroupId: mongoose.Types.ObjectId, chatGroupName: string) {
        const  updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            { chatGroupName: chatGroupName},
            { new: true }
          );
          return updatedChatGroup;
    }
}