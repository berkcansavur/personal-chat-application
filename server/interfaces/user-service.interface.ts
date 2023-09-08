import mongoose from 'mongoose';
import { UserDataDTO } from 'src/users/dtos/user-data.dto';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { ReturnUserDTO } from 'src/users/dtos/return-user.dto';
import { ReturnUserProfile } from 'src/users/users.model';
export interface IUsersService {
    createUser({createUserDTO} : {createUserDTO: CreateUserDTO }):Promise<ReturnUserDTO>;
    findUser({id} : {id:mongoose.Types.ObjectId}): Promise<any>
    findUserByEmail({email} : {email:string}):Promise<any>
    addChatGroupToUser({userId, chatGroup} : {userId: mongoose.Types.ObjectId, chatGroup: object}) : Promise<any>;
    removeChatGroupFromUser({user, chatGroup} : {user:any, chatGroup:any}):Promise<any>;
    addFriend({userId, friend} : {userId:mongoose.Types.ObjectId, friend: object}) : Promise<any>;
    removeFriend({userId, friendId} : {userId:mongoose.Types.ObjectId, friendId: string}) : Promise<any>;
    getFriendsOfUser({userId} : {userId: mongoose.Types.ObjectId}) :Promise<any>;
    getUserData({userId} : {userId: mongoose.Types.ObjectId}): Promise<any>;
    getUsersFriendsData({userId} : {userId:mongoose.Types.ObjectId}) :Promise<any>;
    mapUserProfileInfo({id, name, email, chatGroupDetails, friendsData} : {id:string, name: string, email: string, chatGroupDetails: ChatGroupInfoDTO[], friendsData:UserDataDTO[]}) : Promise<ReturnUserProfile>;
    searchUser({searchText} : {searchText:string}): Promise<any>;
}