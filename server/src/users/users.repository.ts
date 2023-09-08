import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { ReturnUser, ReturnUserDocument, User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { UserDataDTO } from './dtos/user-data.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
@Injectable()
export class UsersRepository { 
    constructor(@InjectModel('Users') private userModel: Model<User>){}
    
    async createUser( {createUserDTO} : {createUserDTO:CreateUserDTO} ) : Promise<ReturnUserDocument>{
        const { userModel } = this;
        return ( await userModel.create(createUserDTO)).toObject();
    }
    async findUserByObjectId( id: mongoose.Types.ObjectId): Promise<ReturnUserDocument>{
        return await this.userModel.findOne({ _id: id });
    }
    async findByEmail(email: string){
        return this.userModel.findOne({email: email});
    }
    async addChatGroupToUser(userId:mongoose.Types.ObjectId, chatGroup:object){
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            {$push:{ChatGroups:chatGroup}},
            {new:true}
        );
        await updatedUser.save();
        return updatedUser;
    }
    async removeChatGroupFromUser(user , chatGroup ){
        const userId: string = user._id;
        const chatGroupId: string = chatGroup._id;
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { ChatGroups: {_id: chatGroupId } } },
            { new:true }
        );
        await updatedUser.save();
    }
    async addFriend(userId:mongoose.Types.ObjectId, friend:object) {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            {$push:{Friends:friend}},
            {new:true}
        );
        await updatedUser.save();
        return updatedUser;
    }
    async removeFriend(userId:mongoose.Types.ObjectId, friendId:mongoose.Types.ObjectId) {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { Friends: { _id: friendId } } },
            { new: true }
        );
        await updatedUser.save();
        return updatedUser;
    }
    async getFriendsOfUser( userId:mongoose.Types.ObjectId) {
        const user = await this.userModel.findOne({ _id: userId });
        const friends = user.Friends;
        return friends;
        
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
    async getUserFriends(userIds:mongoose.Types.ObjectId[]): Promise<ReturnUserDocument[]>{
        return this.userModel.find({ _id: { $in: userIds } });
    }
    async getUsersFriendsData( userId:mongoose.Types.ObjectId){
        const friends = await this.getFriendsOfUser(userId);
        const friendsData = Promise.all(friends.map( async (friend) => {
            return await this.getUserData(friend);
        }));
        return friendsData;

    }
    async searchUser(searchText:string) {
        const users = await this.userModel.find({
            $or: [{ name: { $regex: searchText, $options: "i" } }, { email: { $regex: searchText, $options: "i" } }],
        })
        .exec();
        return users;
    }
}