import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { ReturnUserDocument, ReturnUserToBeAuthDocument, User, UserToBeValidateDocument } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { 
    UserDataDTO,
    CreateUserDTO } from './dtos/user-dtos';
@Injectable()
export class UsersRepository { 
    constructor(
        @InjectModel('Users') private userModel: Model<User>){}
    
    async createUser( {createUserDTO} : {createUserDTO:CreateUserDTO} ) : Promise<ReturnUserDocument>{
        const { userModel } = this;
        return ( await userModel.create(createUserDTO)).toObject();
    }
    async findUserByObjectId( userId: string): Promise<ReturnUserDocument>{
        return await this.userModel.findOne({ _id: userId });
    }
    async findUserByObjectIdForValidating( id: string): Promise<UserToBeValidateDocument>{
        return (await this.userModel.findOne({ _id: id })).toObject();
    }
    async findByEmail(email: string): Promise<ReturnUserDocument>{
        const user = this.userModel.findOne({email: email});
        return (await user).toObject();
    }
    async addChatGroupToUser(userId: string, chatGroupId: string): Promise<ReturnUserDocument>{
        return await this.userModel.findByIdAndUpdate(
            userId,
            {$push:{ ChatGroups: {_id: chatGroupId } }},
            {new:true}
        );
    }
    async removeChatGroupFromUser(userId:string, chatGroupId:string ): Promise<ReturnUserDocument>{
        return await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { ChatGroups: {_id: chatGroupId } } },
            { new:true }
        );
        
    }
    async addFriend(userId:string, friendId:string): Promise<ReturnUserDocument> {
        return await this.userModel.findByIdAndUpdate(
            userId,
            {$push:{ Friends: { _id:friendId } } },
            {new:true}
        );
    }
    async removeFriend(userId:string, friendId:string): Promise<ReturnUserDocument> {
        return await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { Friends: { _id: friendId } } },
            { new: true }
        );
    }
    async getFriendIdsOfUser( userId: string): Promise<string[]> {
        const user = await this.userModel.findOne({ _id: userId });
        const friends = user.Friends.map((friend) => {return friend._id.toString()});
        return friends;
        
    }

    async getUserFriends(userIds:string[]): Promise<ReturnUserDocument[]>{
        
        return await this.userModel.find({ _id: { $in: userIds } });
    }

    async getUserData( userId: string ){
        const user = await this.userModel.findOne({_id: userId});
            const { name, email, ChatGroups,  } = user;
            const userData = new UserDataDTO();
            userData._id = userId;
            userData.name = name;
            userData.email = email;
            userData.ChatGroups = ChatGroups;
            return userData;
    }
    
    async getUsersFriendsData( userId: string){
        const friendIds = await this.getFriendIdsOfUser(userId);
        const friendsData = friendIds.map( async (friendId) => {
            return await this.getUserData(friendId);
        });
        return friendsData;

    }
    async setUsersAccessToken(userId: string, accessToken: string): Promise<ReturnUserToBeAuthDocument>{
        const { userModel } = this;
        const user = await userModel.findByIdAndUpdate(
            userId,
            {accessToken:accessToken},
            {new:true}
        );
        return user.toObject();
    }
    async getUsersAccessToken(userId: string): Promise<ReturnUserToBeAuthDocument>{
        const { userModel } = this;
        return await userModel.findOne({ _id: userId });
    }
    async removeUsersAccessToken(userId: string): Promise<ReturnUserToBeAuthDocument>{
        const { userModel } = this;
        const user =  await userModel.findByIdAndUpdate(
            userId,
            {accessToken:null},
            {new:true}
        );
        return user.toObject();
    }
    async searchUser(searchText:string) {
        const users = await this.userModel.find({
            $or: [{ name: { $regex: searchText, $options: "i" } }, { email: { $regex: searchText, $options: "i" } }],
        })
        .exec();
        return users;
    }
}