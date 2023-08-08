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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UsersService = exports.UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(name, email, password) {
        const newUser = new this.userModel({ name, email, password });
        return await newUser.save();
    }
    async findUser(id) {
        try {
            if (!id) {
                return null;
            }
            const user = await this.userModel.findOne({ _id: id });
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findOne(email) {
        return this.userModel.find(user => user.email === email);
    }
    async findByEmail(email) {
        try {
            return this.userModel.findOne({ email: email });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async addChatGroupToUser(userId, chatGroup) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, { $push: { ChatGroups: chatGroup } }, { new: true });
            await updatedUser.save();
            return updatedUser;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async addFriend(userId, friend) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, { $push: { Friends: friend } }, { new: true });
            await updatedUser.save();
            return updatedUser;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async removeFriend(userId, friendId) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(userId, { $pull: { Friends: { _id: friendId } } }, { new: true });
            await updatedUser.save();
            return updatedUser;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getFriendsOfUser(userId) {
        try {
            const user = await this.findUser(userId);
            const friends = user.Friends;
            return friends;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getUserData(userObject) {
        try {
            const user = await this.userModel.findOne(userObject);
            const { name, email, ChatGroups, _id } = user;
            const userData = {
                _id: _id,
                name: name,
                email: email,
                ChatGroups: ChatGroups
            };
            return userData;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async searchUser(searchText) {
        const users = await this.userModel.find({
            $or: [{ name: { $regex: searchText, $options: "i" } }, { email: { $regex: searchText, $options: "i" } }],
        })
            .exec();
        return users;
    }
};
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Users')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map