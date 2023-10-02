import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { CreateChatGroupDTO } from "./dtos/chat-group-dtos";
import { ChatGroups, ReturnChatGroupDocument } from "./chat-groups.model";

@Injectable()
export class ChatGroupsRepository {
    constructor(
        @InjectModel('ChatGroups') private ChatGroupsModel: Model<ChatGroups>){}

    async createChatGroup({createChatGroupDTO}:{createChatGroupDTO:CreateChatGroupDTO}) : Promise<ReturnChatGroupDocument>{
        const {ChatGroupsModel} = this;
        return ( await ChatGroupsModel.create(createChatGroupDTO)).toObject();
    }
    async deleteChatGroup({chatGroupId}:{chatGroupId: string}) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findByIdAndRemove(chatGroupId);
    }
    async getChatGroupByObjectId({id}:{id:string}) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findOne({_id:id});
    }
    async getChatGroupByStringId({id}:{id:string}) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findOne({_id:id});
    }
    async getChatGroupsUsers(id:string) : Promise<string[]>{
        const chatGroup = await this.ChatGroupsModel.findById(id);
        if (!chatGroup) {
            throw new Error('Chat group not found');
        }
        const users = chatGroup.users.map((userId)=>{return userId.toString()});
        return users;
    }
    async addUserToChatGroup(chatGroupId: string, userId: string) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            {$push: { users: { _id: userId } } },
            {new:true}
        );
    }
    async removeUserFromChatGroup(chatGroupId: string, userId: string) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            { $pull: { users: { _id: userId } } },
            { new: true } 
        );            
    }
    async updateChatGroupName(chatGroupId: mongoose.Types.ObjectId, chatGroupName: string) : Promise<ReturnChatGroupDocument>{
        return await this.ChatGroupsModel.findByIdAndUpdate(
            chatGroupId,
            { chatGroupName: chatGroupName},
            { new: true }
          );
    }
}