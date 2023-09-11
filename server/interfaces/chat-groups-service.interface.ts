import mongoose from "mongoose"
import { 
    ReturnChatGroupDTO,
    CreateChatGroupDTO,
    ChatGroupInfoDTO, 
    UpdateChatGroupsNameDTO} from "src/chat-groups/dtos/chat-group-dtos";

export interface IChatGroupService {
    createChatGroup({createChatGroupDTO}:{createChatGroupDTO: CreateChatGroupDTO, }): Promise<ReturnChatGroupDTO>;
    deleteChatGroup({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}) : Promise<any>;
    getChatGroup({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}): Promise<ChatGroupInfoDTO>;
    getChatGroupDetails({chatGroups} : {chatGroups:mongoose.Types.ObjectId[]}): Promise<ChatGroupInfoDTO[]>;
    getChatGroupByStringId({chatGroupId}:{chatGroupId: string}): Promise<ChatGroupInfoDTO>;
    getChatGroupsUsers({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}): Promise<mongoose.Types.ObjectId[]>;
    addUserToChatGroup({chatGroupId, userId } : {chatGroupId:mongoose.Types.ObjectId, userId:mongoose.Types.ObjectId}): Promise<ChatGroupInfoDTO>;
    removeUserFromChatGroup({chatGroupId,userId } : {chatGroupId:mongoose.Types.ObjectId, userId:mongoose.Types.ObjectId}): Promise<ChatGroupInfoDTO>;
    updateChatGroupName({updateChatGroupsNameDto}:{updateChatGroupsNameDto: UpdateChatGroupsNameDTO}): Promise<ChatGroupInfoDTO>;
    
}
export interface UserInterfaceForMessaging {
    UserID:string; 
    name: string;
    email: string;
    password: string;
    Friends: object[];
    ChatGroups: object[];
    socketId: string;
  }