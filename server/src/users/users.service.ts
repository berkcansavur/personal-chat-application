import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
@Injectable()
export class UsersService {

    constructor(@InjectModel('Users') private userModel: Model<User>){}

    async createUser(name: string, email: string, password: string){
        const newUser = new this.userModel({name, email, password});
        return await newUser.save();
    }
    async findUserById(id: string ){
        try {
            if(!id){
                return null;
            }
            const user = await this.userModel.findOne({_id: id});
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findUser(id: mongoose.Types.ObjectId ){
        try {
            if(!id){
                return null;
            }
            const user = await this.userModel.findOne({_id: id});
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findOne(email: string){
        return this.userModel.find(user => user.email === email);
    }
    async findByEmail(email: string){
        try {
            return this.userModel.findOne({email: email});
        } catch (error) {
            throw new Error(error);
        }
    }
    async addChatGroupToUser(userId:string, chatGroup:object){
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                {$push:{ChatGroups:chatGroup}},
                {new:true}
            );
            await updatedUser.save();
            return updatedUser;
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeChatGroupFromUser(user, chatGroup){
        try {
            const userId:string = user._id;
            const chatGroupId:string = chatGroup._id;

            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { $pull: { ChatGroups: {_id: chatGroupId } } },
                { new:true }
            );
            await updatedUser.save();
        } catch (error) {
            throw new Error(error);
        }
    }
    async addFriend(userId:string, friend:object) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                {$push:{Friends:friend}},
                {new:true}
            );
            await updatedUser.save();
            return updatedUser;
        } catch (error) {
            throw new Error(error);
        }
    }
    async removeFriend(userId:string, friendId:string) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(
                userId,
                { $pull: { Friends: { _id: friendId } } },
                { new: true }
            );
            await updatedUser.save();
            return updatedUser;
        } catch (error) {
            throw new Error(error);
        }
    }
    async getFriendsOfUser( userId:mongoose.Types.ObjectId) {
        try {
            const user = await this.findUser(userId);
            const friends : object[] = user.Friends;
            return friends;
        } catch (error) {
            throw new Error(error);
        }
    }
    async getUserData(userObject:Object){
        try {
            const user = await this.userModel.findOne(userObject);
            const {name, email, ChatGroups, _id } = user;
            const userData = {
                _id: _id,
                name: name,
                email: email,
                ChatGroups: ChatGroups
            }
            return userData;
        } catch (error) {
            throw new Error(error);
        }
    }
    async searchUser(searchText:string) {
        const users = await this.userModel.find({
            $or: [{ name: { $regex: searchText, $options: "i" } }, { email: { $regex: searchText, $options: "i" } }],
        })
        .exec();
        return users;
    }
}
