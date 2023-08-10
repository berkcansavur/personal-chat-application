import { ChatGroups } from './chat-groups.model';
import { Model } from 'mongoose';
import { CreateChatGroupDTO } from './dtos/create-chat-group.dto';
import mongoose from "mongoose";
import { User } from 'src/users/users.model';
export declare class ChatGroupsService {
    private ChatGroupsModel;
    constructor(ChatGroupsModel: Model<ChatGroups>);
    createChatGroup(chatGroup: CreateChatGroupDTO, creatorUser: any): Promise<mongoose.Document<unknown, {}, ChatGroups> & ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    deleteChatGroup(chatGroupId: mongoose.Types.ObjectId): Promise<void>;
    getChatGroupById(chatGroupId: string): Promise<mongoose.Document<unknown, {}, ChatGroups> & ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    getChatGroupByObjectId(id: object): Promise<mongoose.Document<unknown, {}, ChatGroups> & ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    getChatGroupsUsers(id: mongoose.Types.ObjectId): Promise<object[]>;
    addUserToChatGroup(chatGroupId: string, user: User): Promise<mongoose.Document<unknown, {}, ChatGroups> & ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    removeUserFromChatGroup(chatGroupId: string, userId: string): Promise<mongoose.Document<unknown, {}, ChatGroups> & ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    updateChatGroupName(chatGroupId: string, chatGroupName: string): Promise<mongoose.Document<unknown, {}, ChatGroups> & ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
}
