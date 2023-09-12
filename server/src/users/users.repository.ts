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
    async findUserByObjectId( userId: mongoose.Types.ObjectId): Promise<ReturnUserDocument>{
        return await this.userModel.findOne({ _id: userId });
    }
    async findUserByObjectIdForValidating( id: mongoose.Types.ObjectId): Promise<UserToBeValidateDocument>{
        return await this.userModel.findOne({ _id: id });
    }
    async findByEmail(email: string): Promise<ReturnUserDocument>{
        return this.userModel.findOne({email: email});
    }
    async addChatGroupToUser(userId:mongoose.Types.ObjectId, chatGroupId:mongoose.Types.ObjectId): Promise<ReturnUserDocument>{
        return await this.userModel.findByIdAndUpdate(
            userId,
            {$push:{ ChatGroups: {_id: chatGroupId } }},
            {new:true}
        );
    }
    async removeChatGroupFromUser(userId:mongoose.Types.ObjectId, chatGroupId:mongoose.Types.ObjectId ): Promise<ReturnUserDocument>{
        return await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { ChatGroups: {_id: chatGroupId } } },
            { new:true }
        );
        
    }
    async addFriend(userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId): Promise<ReturnUserDocument> {
        return await this.userModel.findByIdAndUpdate(
            userId,
            {$push:{ Friends: { _id:friendId } } },
            {new:true}
        );
    }
    async removeFriend(userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId): Promise<ReturnUserDocument> {
        return await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { Friends: { _id: friendId } } },
            { new: true }
        );
    }
    async getFriendIdsOfUser( userId:mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> {
        const user = await this.userModel.findOne({ _id: userId });
        const friends = user.Friends;
        return friends;
        
    }

    async getUserFriends(userIds:mongoose.Types.ObjectId[]): Promise<ReturnUserDocument[]>{
        
        return await this.userModel.find({ _id: { $in: userIds } });
    }

    async getUserData( userId: mongoose.Types.ObjectId ){
        const user = await this.userModel.findOne(userId);
            const { name, email, ChatGroups,  } = user;
            const userData = new UserDataDTO();
            userData._id = userId;
            userData.name = name;
            userData.email = email;
            userData.ChatGroups = ChatGroups;
            return userData;
    }
    
    async getUsersFriendsData( userId:mongoose.Types.ObjectId){
        const friendIds = await this.getFriendIdsOfUser(userId);
        const friendsData = friendIds.map( async (friendId) => {
            return await this.getUserData(friendId);
        });
        return friendsData;

    }
    async setUsersAccessToken(userId: string, accessToken: string): Promise<ReturnUserToBeAuthDocument>{
        const { userModel } = this;
        return await userModel.findByIdAndUpdate(
            userId,
            {accessToken:accessToken},
            {new:true}
        );
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