import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import { UserDataDTO } from './dtos/user-data.dto';
@Injectable()
export class UsersRepository { 
    constructor(@InjectModel('Users') private userModel: Model<User>){}
    
    async createUser( name:string, email:string, password:string ){
        const newUser = new this.userModel({ name, email, password });
        return await newUser.save();
    }
    async findUserByObjectId( id: mongoose.Types.ObjectId){
        const user = await this.userModel.findOne({ _id: id });
        return user;
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
    async removeFriend(userId:mongoose.Types.ObjectId, friendId:string) {
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
        const friends : object[] = user.Friends;
        return friends;
        
    }
    async getUserData( userObject: Object ){
        const user = await this.userModel.findOne(userObject);
            const { name, email, ChatGroups, _id } = user;
            const userData = new UserDataDTO();
            userData._id = _id;
            userData.name = name;
            userData.email = email;
            userData.ChatGroups = ChatGroups;
            return userData;
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