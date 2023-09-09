import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CreateChatGroupDTO } from "./dtos/create-chat-group.dto";
import { ChatGroups, ReturnChatGroupDocument } from "./chat-groups.model";
import { User } from 'src/users/users.model';

@Injectable()
export class ChatGroupsRepository {
    constructor(
        @InjectModel('ChatGroups') private ChatGroupsModel: Model<ChatGroups>){}

    async createChatGroup({createChatGroupDTO}:{createChatGroupDTO:CreateChatGroupDTO}): Promise<ReturnChatGroupDocument>{
        const {ChatGroupsModel} = this;
        return ( await ChatGroupsModel.create(createChatGroupDTO)).toObject();
    }
    async deleteChatGroup({chatGroupId}:{chatGroupId: mongoose.Types.ObjectId}): Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findByIdAndRemove(chatGroupId);
    }
    async getChatGroupByObjectId({id}:{id:mongoose.Types.ObjectId}) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findById(id);
    }
    async getChatGroupsUsers(id:mongoose.Types.ObjectId){
        const chatGroup = await this.ChatGroupsModel.findById(id);
        if (!chatGroup) {
            throw new Error('Chat group not found');
        }
        const users = chatGroup.users;
        return users;
    }
    async addUserToChatGroup(chatGroupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId): Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            {$push: { users: { _id: userId } } },
            {new:true}
        );
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