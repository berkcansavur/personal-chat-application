import mongoose from 'mongoose';
import { UserDataDTO } from 'src/users/dtos/user-data.dto';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { ReturnUserDTO } from 'src/users/dtos/return-user.dto';
import { ReturnUserProfile } from 'src/users/users.model';
import { FriendInfoDTO } from 'src/users/dtos/friend-info.dto';
import { UserToBeValidateDTO } from 'src/users/dtos/user-tobe-validate.dto';
import { UserProfileInfoDTO } from 'src/users/dtos/user-profile-info.dto';
export interface IUsersService {
    createUser({createUserDTO} : {createUserDTO: CreateUserDTO }):Promise<ReturnUserDTO>;
    findUser({id} : {id:mongoose.Types.ObjectId}): Promise<UserProfileInfoDTO>;
    findUserByEmail({email} : {email:string}): Promise<UserProfileInfoDTO>;
    addChatGroupToUser({userId, chatGroupId} : {userId: mongoose.Types.ObjectId, chatGroupId: mongoose.Types.ObjectId}) : Promise<UserProfileInfoDTO>;
    removeChatGroupFromUser({userId, chatGroupId} : {userId: mongoose.Types.ObjectId, chatGroupId: mongoose.Types.ObjectId}): Promise<UserProfileInfoDTO>;
    addFriend({userId, friendId} : {userId:mongoose.Types.ObjectId, friendId: mongoose.Types.ObjectId}) : Promise<FriendInfoDTO>;
    removeFriend({userId, friendId} : {userId:mongoose.Types.ObjectId, friendId: mongoose.Types.ObjectId}) : Promise<FriendInfoDTO>;
    getFriendIdsOfUser({userId} : {userId: mongoose.Types.ObjectId}) : Promise<mongoose.Types.ObjectId[]>;
    getUserToBeValidate({id}:{id: mongoose.Types.ObjectId} ) : Promise<UserToBeValidateDTO>
    mapUserProfileInfo({id, name, email, chatGroupDetails, friendsData} : {id:mongoose.Types.ObjectId, name: string, email: string, chatGroupDetails: ChatGroupInfoDTO[], friendsData:UserDataDTO[]}) : Promise<ReturnUserProfile>;
    searchUser({searchText} : {searchText:string}): Promise<any>;
}