import mongoose from 'mongoose';
import { UserDataDTO } from 'src/users/dtos/user-data.dto';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
export interface IUsersService {
    createUser({name, email, password} : {name: string, email : string, password: string }):Promise<CreateUserDTO>;
    findUser({id} : {id:mongoose.Types.ObjectId}): Promise<any>
    findUserByEmail({email} : {email:string}):Promise<any>
    addChatGroupToUser({userId, chatGroup} : {userId: mongoose.Types.ObjectId, chatGroup: object}) : Promise<any>;
    removeChatGroupFromUser({user, chatGroup} : {user:any, chatGroup:any}):Promise<any>;
    addFriend({userId, friend} : {userId:mongoose.Types.ObjectId, friend: object}) : Promise<any>;
    removeFriend({userId, friendId} : {userId:mongoose.Types.ObjectId, friendId: string}) : Promise<any>;
    getFriendsOfUser({userId} : {userId: mongoose.Types.ObjectId}) :Promise<any>;
    getUserData({userObject} : {userObject: object}): Promise<any>;
    getUsersFriendsData({userId} : {userId:mongoose.Types.ObjectId}) :Promise<any>;
    getUserProfileInfo({id, name, email, chatGroupDetails, friendsData} : {id:string, name: string, email: string, chatGroupDetails: ChatGroupInfoDTO[], friendsData:UserDataDTO[]}) : Promise<any>;
    searchUser({searchText} : {searchText:string}): Promise<any>;
}