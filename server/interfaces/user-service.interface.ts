import mongoose from 'mongoose';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { ReturnUserProfile } from 'src/users/users.model';
import { 
    UserToBeValidateDTO,
    FriendInfoDTO,
    UserProfileInfoDTO,
    UserDataDTO,
    ReturnUserDTO,
    CreateUserDTO
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
    mapUserProfileInfo({userId, name, email, chatGroupDetails, friendsData} : {userId:mongoose.Types.ObjectId, name: string, email: string, chatGroupDetails: ChatGroupInfoDTO[], friendsData:UserDataDTO[]}) : Promise<ReturnUserProfile>;
    searchUser({searchText} : {searchText:string}): Promise<any>;
}