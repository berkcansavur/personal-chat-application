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
exports.ChatGroupsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ChatGroupsService = exports.ChatGroupsService = class ChatGroupsService {
    constructor(ChatGroupsModel) {
        this.ChatGroupsModel = ChatGroupsModel;
    }
    async createChatGroup(chatGroup, creatorUser) {
        const users = chatGroup.users || [];
        users.push(creatorUser);
        const chatGroupName = chatGroup.chatGroupName;
        const creatingDate = Date.now();
        const newChatGroup = new this.ChatGroupsModel({ users, chatGroupName, creatingDate });
        return await newChatGroup.save();
    }
    async deleteChatGroup(chatGroupId) {
        await this.ChatGroupsModel.findByIdAndRemove(chatGroupId);
    }
    async getChatGroupById(chatGroupId) {
        try {
            if (!chatGroupId) {
                return null;
            }
            return await this.ChatGroupsModel.findById(chatGroupId);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupByObjectId(id) {
        try {
            if (!id) {
                return null;
            }
            return await this.ChatGroupsModel.findById(id);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async getChatGroupsUsers(id) {
        try {
            const chatGroup = await this.ChatGroupsModel.findById(id);
            if (!chatGroup) {
                throw new Error('Chat group not found');
            }
            const users = chatGroup.users.map((user) => user);
            return users;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async addUserToChatGroup(chatGroupId, user) {
        try {
            const updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(chatGroupId, { $push: { users: user } }, { new: true });
            await updatedChatGroup.save();
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async removeUserFromChatGroup(chatGroupId, userId) {
        try {
            const updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(chatGroupId, { $pull: { users: { _id: userId } } }, { new: true });
            await updatedChatGroup.save();
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateChatGroupName(chatGroupId, chatGroupName) {
        try {
            let updatedChatGroup = await this.ChatGroupsModel.findByIdAndUpdate(chatGroupId, { chatGroupName: chatGroupName }, { new: true });
            return updatedChatGroup;
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.ChatGroupsService = ChatGroupsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('ChatGroups')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatGroupsService);
//# sourceMappingURL=chat-groups.service.js.map