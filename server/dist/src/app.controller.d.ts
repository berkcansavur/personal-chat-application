import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { ChatGroupsService } from './chat-groups/chat-groups.service';
import mongoose from 'mongoose';
import { CreateChatGroupDTO } from './chat-groups/dtos/create-chat-group.dto';
export declare class AppController {
    private readonly appService;
    private authService;
    private userService;
    private chatGroupService;
    constructor(appService: AppService, authService: AuthService, userService: UsersService, chatGroupService: ChatGroupsService);
    getHello(): string;
    login(req: any): Promise<{
        access_token: string;
        user: {
            userId: number;
            userName: string;
            userEmail: string;
        };
    }>;
    getUserProfile(req: any): Promise<{
        UserID: string;
        UserName: string;
        UserEmail: string;
        ChatGroups: any[];
        Friends: any[];
    }>;
    addFriendsToChatGroup(chatGroupId: string, friendId: mongoose.Types.ObjectId): Promise<mongoose.Document<unknown, {}, import("./chat-groups/chat-groups.model").ChatGroups> & import("./chat-groups/chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    removeFriendsFromChatGroup(chatGroupId: string, friendId: string): Promise<mongoose.Document<unknown, {}, import("./chat-groups/chat-groups.model").ChatGroups> & import("./chat-groups/chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    addUserToChatGroup(body: {
        chatGroupId: object;
    }, req: any): Promise<mongoose.Document<unknown, {}, import("./chat-groups/chat-groups.model").ChatGroups> & import("./chat-groups/chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    addFriend(friendId: mongoose.Types.ObjectId, req: any): Promise<mongoose.Document<unknown, {}, import("./users/users.model").User> & import("./users/users.model").User & Required<{
        _id: string;
    }>>;
    removeFriend(friendId: mongoose.Types.ObjectId, req: any): Promise<mongoose.Document<unknown, {}, import("./users/users.model").User> & import("./users/users.model").User & Required<{
        _id: string;
    }>>;
    getFriends(req: any): Promise<any[]>;
    getChatGroupsUsersInfo(chatGroupId: mongoose.Types.ObjectId): Promise<any[]>;
    createChatGroup(body: CreateChatGroupDTO, req: any): Promise<mongoose.Document<unknown, {}, import("./chat-groups/chat-groups.model").ChatGroups> & import("./chat-groups/chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    deleteChatGroup(chatGroupId: mongoose.Types.ObjectId): Promise<void>;
    getChatGroup(chatGroupId: mongoose.Types.ObjectId, req: any): Promise<mongoose.Document<unknown, {}, import("./chat-groups/chat-groups.model").ChatGroups> & import("./chat-groups/chat-groups.model").ChatGroups & {
        _id: mongoose.Types.ObjectId;
    }>;
    searchUser(searchText: string): Promise<(mongoose.Document<unknown, {}, import("./users/users.model").User> & import("./users/users.model").User & Required<{
        _id: string;
    }>)[]>;
}
