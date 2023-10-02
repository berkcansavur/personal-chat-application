import { ReturnUserProfile } from 'src/users/users.model';
import { AuthenticatedUserDTO } from '../src/users/dtos/user-dtos';
import { 
    UserToBeValidateDTO,
    FriendInfoDTO,
    UserProfileInfoDTO,
    ReturnUserDTO,
    CreateUserDTO,
    MapUserInfoDTO
     } from 'src/users/dtos/user-dtos';
export interface IUsersService {
    createUser({createUserDTO} : {createUserDTO: CreateUserDTO }):Promise<ReturnUserDTO>;
    findUser({userId} : {userId:string}): Promise<UserProfileInfoDTO>;
    findUserByEmail({email} : {email:string}): Promise<UserProfileInfoDTO>;
    addChatGroupToUser({userId, chatGroupId} : {userId: string, chatGroupId: string}) : Promise<UserProfileInfoDTO>;
    removeChatGroupFromUser({userId, chatGroupId} : {userId: string, chatGroupId: string}): Promise<UserProfileInfoDTO>;
    addFriend({userId, friendId} : {userId:string, friendId: string}) : Promise<FriendInfoDTO>;
    removeFriend({userId, friendId} : {userId:string, friendId: string}) : Promise<FriendInfoDTO>;
    getFriendIdsOfUser({userId} : {userId: string}) : Promise<string[]>;
    getUserToBeValidate({userId}:{userId: string} ) : Promise<UserToBeValidateDTO>
    mapUserProfileInfo({mapUserInfoDTO}:{mapUserInfoDTO:MapUserInfoDTO}) : Promise<ReturnUserProfile>;
    setUsersAccessToken({authenticatedUserDto}:{authenticatedUserDto:AuthenticatedUserDTO}): Promise<AuthenticatedUserDTO>;
    removeUsersAccessToken({userId}:{userId:string}): Promise<AuthenticatedUserDTO>;
    searchUser({searchText} : {searchText:string}): Promise< ReturnUserDTO[] | null>;
}