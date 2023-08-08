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
exports.ChatGroupsController = void 0;
const common_1 = require("@nestjs/common");
const chat_groups_service_1 = require("./chat-groups.service");
const users_service_1 = require("../users/users.service");
const create_chat_group_dto_1 = require("./dtos/create-chat-group.dto");
const mongoose_1 = require("mongoose");
let ChatGroupsController = exports.ChatGroupsController = class ChatGroupsController {
    constructor(chatGroupsService, usersService) {
        this.chatGroupsService = chatGroupsService;
        this.usersService = usersService;
    }
    async createChatGroup(body, session) {
        if (!session.CurrentUser._id) {
            throw new common_1.UnauthorizedException('You need to login to create a chat group');
        }
        const user = await this.usersService.findUser(session.CurrentUser._id);
        const newChatGroup = await this.chatGroupsService.createChatGroup(body, user);
        return newChatGroup;
    }
    async getChatGroupUsers(id) {
        const users = await this.chatGroupsService.getChatGroupsUsers(id);
        return users;
    }
    async addUserToChatGroup(body, session) {
        try {
            const user = await this.usersService.findUser(session.CurrentUser._id);
            return await this.chatGroupsService.addUserToChatGroup(body.chatGroupId, user);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async removeUserFromChatGroup(chatGroupId, body) {
        try {
            const updatedChatGroup = await this.chatGroupsService.removeUserFromChatGroup(chatGroupId, body.userId);
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateGroupName(chatGroupId, body) {
        try {
            const updatedChatGroup = await this.chatGroupsService.updateChatGroupName(chatGroupId, body.newName);
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
__decorate([
    (0, common_1.Post)('/create-chat-group'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chat_group_dto_1.CreateChatGroupDTO, Object]),
    __metadata("design:returntype", Promise)
], ChatGroupsController.prototype, "createChatGroup", null);
__decorate([
    (0, common_1.Get)('/get-users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], ChatGroupsController.prototype, "getChatGroupUsers", null);
__decorate([
    (0, common_1.Post)('/add-user'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGroupsController.prototype, "addUserToChatGroup", null);
__decorate([
    (0, common_1.Post)('/remove-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGroupsController.prototype, "removeUserFromChatGroup", null);
__decorate([
    (0, common_1.Post)('/change-group-name/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatGroupsController.prototype, "updateGroupName", null);
exports.ChatGroupsController = ChatGroupsController = __decorate([
    (0, common_1.Controller)('chat-groups'),
    __metadata("design:paramtypes", [chat_groups_service_1.ChatGroupsService,
        users_service_1.UsersService])
], ChatGroupsController);
//# sourceMappingURL=chat-groups.controller.js.map