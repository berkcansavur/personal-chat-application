import { ChatGroupsService } from './chat-groups.service';
import { UsersService } from 'src/users/users.service';
import { CreateChatGroupDTO } from './dtos/create-chat-group.dto';
import mongoose from 'mongoose';
export declare class ChatGroupsController {
    private chatGroupsService;
    private usersService;
    constructor(chatGroupsService: ChatGroupsService, usersService: UsersService);
    createChatGroup(body: CreateChatGroupDTO, session: any): Promise<mongoose.Document<unknown, {}, import("./chat-groups.model").ChatGroups> & import("./chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    getChatGroupUsers(id: mongoose.Types.ObjectId): Promise<object[]>;
    addUserToChatGroup(body: {
        chatGroupId: string;
    }, session: any): Promise<mongoose.Document<unknown, {}, import("./chat-groups.model").ChatGroups> & import("./chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    removeUserFromChatGroup(chatGroupId: string, body: {
        userId: string;
    }): Promise<mongoose.Document<unknown, {}, import("./chat-groups.model").ChatGroups> & import("./chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    updateGroupName(chatGroupId: string, body: {
        newName: string;
    }): Promise<mongoose.Document<unknown, {}, import("./chat-groups.model").ChatGroups> & import("./chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
}
