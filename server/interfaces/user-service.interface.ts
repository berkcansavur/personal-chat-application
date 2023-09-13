import mongoose from 'mongoose';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-dtos';
import { ReturnUserProfile } from 'src/users/users.model';
import { AuthenticatedUserDTO } from '../src/users/dtos/user-dtos';
import { 
    UserToBeValidateDTO,
    FriendInfoDTO,
    UserProfileInfoDTO,
    UserDataDTO,
    ReturnUserDTO,
    CreateUserDTO,
    MapUserInfoDTO
     } from 'src/users/dtos/user-dtos';
export interface IUsersService {
    createUser({createUserDTO} : {createUserDTO: CreateUserDTO }):Promise<ReturnUserDTO>;
    findUser({userId} : {userId:mongoose.Types.ObjectId}): Promise<UserProfileInfoDTO>;
    findUserByEmail({email} : {email:string}): Promise<UserProfileInfoDTO>;
    addChatGroupToUser({userId, chatGroupId} : {userId: mongoose.Types.ObjectId, chatGroupId: mongoose.Types.ObjectId}) : Promise<UserProfileInfoDTO>;
    removeChatGroupFromUser({userId, chatGroupId} : {userId: mongoose.Types.ObjectId, chatGroupId: mongoose.Types.ObjectId}): Promise<UserProfileInfoDTO>;
    addFriend({userId, friendId} : {userId:mongoose.Types.ObjectId, friendId: mongoose.Types.ObjectId}) : Promise<FriendInfoDTO>;
    removeFriend({userId, friendId} : {userId:mongoose.Types.ObjectId, friendId: mongoose.Types.ObjectId}) : Promise<FriendInfoDTO>;
    getFriendIdsOfUser({userId} : {userId: mongoose.Types.ObjectId}) : Promise<mongoose.Types.ObjectId[]>;
    getUserToBeValidate({userId}:{userId: mongoose.Types.ObjectId} ) : Promise<UserToBeValidateDTO>
    mapUserProfileInfo({mapUserInfoDTO}:{mapUserInfoDTO:MapUserInfoDTO}) : Promise<ReturnUserProfile>;
    setUsersAccessToken({authenticatedUserDto}:{authenticatedUserDto:AuthenticatedUserDTO}): Promise<AuthenticatedUserDTO>;
    removeUsersAccessToken({userId}:{userId:string}): Promise<AuthenticatedUserDTO>;
    searchUser({searchText} : {searchText:string}): Promise<any>;
}