import mongoose from "mongoose"
import { ChatGroupInfoDTO } from "src/chat-groups/dtos/chat-group-info.dto";
import { CreateChatGroupDTO } from "src/chat-groups/dtos/create-chat-group.dto";

export interface IChatGroupService {
    createChatGroup({chatGroup, creatorUser}:{chatGroup: CreateChatGroupDTO, creatorUser:any}):Promise<any>;
    deleteChatGroup({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}) : Promise<any>;
    getChatGroup({id} : {id:mongoose.Types.ObjectId}): Promise<any>;
    getChatGroupDetails({chatGroups} : {chatGroups:mongoose.Types.ObjectId[]}): Promise<any>;
    getChatGroupsUsers({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}): Promise<any>;
    addUserToChatGroup({chatGroupId, user } : {chatGroupId: mongoose.Types.ObjectId, user:any}): Promise<ChatGroupInfoDTO>;
    removeUserFromChatGroup({chatGroupId,userId } : {chatGroupId: mongoose.Types.ObjectId, userId:mongoose.Types.ObjectId}): Promise<any>;
    updateChatGroupName({chatGroupId, chatGroupName}:{chatGroupId: mongoose.Types.ObjectId, chatGroupName: string}): Promise<any>;
    
}