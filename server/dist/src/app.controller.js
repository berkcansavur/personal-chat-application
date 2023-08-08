"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth/auth.service");
const jwt_auth_guard_1 = require("./auth/jwt.auth.guard");
const users_service_1 = require("./users/users.service");
const chat_groups_service_1 = require("./chat-groups/chat-groups.service");
const mongoose_1 = require("mongoose");
const create_chat_group_dto_1 = require("./chat-groups/dtos/create-chat-group.dto");
let AppController = exports.AppController = class AppController {
    constructor(appService, authService, userService, chatGroupService) {
        this.appService = appService;
        this.authService = authService;
        this.userService = userService;
        this.chatGroupService = chatGroupService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async login(req) {
        return this.authService.loginWithCredentials(req.user);
    }
    async getUserProfile(req) {
        try {
            const user = await this.userService.findUser(req.user.userId);
            const { _id, name, email, ChatGroups } = user;
            const chatGroupDetails = [];
            const friends = await this.userService.getFriendsOfUser(req.user.userId);
            const friendsData = [];
            for (const friend of friends) {
                const friendData = await this.userService.getUserData(friend);
                friendsData.push(friendData);
            }
            for (let chatGroupId of ChatGroups) {
                const chatGroup = await this.chatGroupService.getChatGroupByObjectId(chatGroupId);
                chatGroupDetails.push({
                    _id: chatGroup._id,
                    chatGroupName: chatGroup.chatGroupName,
                });
            }
            return {
                UserID: _id,
                UserName: name,
                UserEmail: email,
                ChatGroups: chatGroupDetails,
                Friends: friendsData
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async addFriendsToChatGroup(chatGroupId, friendId) {
        try {
            const friendToAdd = await this.userService.findUser(friendId);
            const updatedChatGroup = await this.chatGroupService.addUserToChatGroup(chatGroupId, friendToAdd);
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async removeFriendsFromChatGroup(chatGroupId, friendId) {
        try {
            const updatedChatGroup = await this.chatGroupService.removeUserFromChatGroup(chatGroupId, friendId);
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async addUserToChatGroup(body, req) {
        try {
            const id = req.user.userId;
            const stringifiedChatGroupId = body.chatGroupId.toString();
            if (!id) {
                throw new common_1.UnauthorizedException('You need to login to create a chat group');
            }
            const chatGroupToUpdate = await this.chatGroupService.getChatGroupById(stringifiedChatGroupId);
            const updatedUser = await this.userService.addChatGroupToUser(id, chatGroupToUpdate);
            const updatedChatGroup = await this.chatGroupService.addUserToChatGroup(stringifiedChatGroupId, updatedUser);
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async addFriend(friendId, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('You must be logged in for adding friend');
        }
        const friend = await this.userService.findUser(friendId);
        const updatedUser = await this.userService.addFriend(req.user.userId, friend);
        return updatedUser;
    }
    async removeFriend(friendId, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('You must be logged in for removing friend');
        }
        const friend = await this.userService.findUser(friendId);
        const updatedUser = await this.userService.removeFriend(req.user.userId, friend._id);
        return updatedUser;
    }
    async getFriends(req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('You must be logged in for view friends');
        }
        const friends = await this.userService.getFriendsOfUser(req.user.userId);
        const friendsData = [];
        for (const friend of friends) {
            const friendData = await this.userService.getUserData(friend);
            friendsData.push(friendData);
        }
        return friendsData;
    }
    async getChatGroupsUsersInfo(chatGroupId) {
        if (!chatGroupId) {
            throw new common_1.UnauthorizedException('You must provide an existing chatgroup!');
        }
        const friends = await this.chatGroupService.getChatGroupsUsers(chatGroupId);
        const friendsData = [];
        for (const friend of friends) {
            const friendData = await this.userService.getUserData(friend);
            friendsData.push(friendData);
        }
        return friendsData;
    }
    async createChatGroup(body, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('You need to login to create a chat group');
        }
        const user = await this.userService.findUser(req.user.userId);
        const newChatGroup = await this.chatGroupService.createChatGroup(body, user);
        await this.userService.addChatGroupToUser(req.user.userId, newChatGroup);
        return newChatGroup;
    }
    async deleteChatGroup(chatGroupId, req) {
        try {
            const chatGroupToBeDelete = await this.chatGroupService.getChatGroupByObjectId(chatGroupId);
            const usersOfChatGroup = await this.chatGroupService.getChatGroupsUsers(chatGroupId);
            for (let user of usersOfChatGroup) {
                await this.userService.removeChatGroupFromUser(user, chatGroupToBeDelete);
            }
            await this.chatGroupService.deleteChatGroup(chatGroupId);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getChatGroup(chatGroupId, req) {
        if (!req.user) {
            throw new common_1.UnauthorizedException('You need to login to create a chat group');
        }
        const chatGroup = await this.chatGroupService.getChatGroupByObjectId(chatGroupId);
        return chatGroup;
    }
    async searchUser(searchText) {
        const users = await this.userService.searchUser(searchText);
        return users;
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/add-friends-to-chat-group/:chatGroupId/:friendId'),
    __param(0, (0, common_1.Param)('chatGroupId')),
    __param(1, (0, common_1.Param)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mongoose_1.default.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addFriendsToChatGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/remove-friends-to-chat-group/:chatGroupId/:friendId'),
    __param(0, (0, common_1.Param)('chatGroupId')),
    __param(1, (0, common_1.Param)('friendId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeFriendsFromChatGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('add-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addUserToChatGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/add-friend/:friendId'),
    __param(0, (0, common_1.Param)('friendId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addFriend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/remove-friend/:friendId'),
    __param(0, (0, common_1.Param)('friendId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "removeFriend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/get-friends'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFriends", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/get-chatgroups-friends-data/:chatGroupId'),
    __param(0, (0, common_1.Param)('chatGroupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getChatGroupsUsersInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('/create-chat-group'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_group_dto_1.CreateChatGroupDTO, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createChatGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('/delete-chat-group/:chatGroupId'),
    __param(0, (0, common_1.Param)('chatGroupId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteChatGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/get-chat-group/:chatGroupId'),
    __param(0, (0, common_1.Param)('chatGroupId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getChatGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/search-user'),
    __param(0, (0, common_1.Query)("searchText")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "searchUser", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('app'),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService,
        users_service_1.UsersService,
        chat_groups_service_1.ChatGroupsService])
], AppController);
//# sourceMappingURL=app.controller.js.map