import mongoose from "mongoose"

import { ChatGroupInfoDTO } from "src/chat-groups/dtos/chat-group-info.dto";
import { CreateChatGroupDTO } from "src/chat-groups/dtos/create-chat-group.dto";
import { ReturnChatGroupDTO } from "src/chat-groups/dtos/return-chat-groups.dto";

export interface IChatGroupService {
    createChatGroup({createChatGroupDTO}:{createChatGroupDTO: CreateChatGroupDTO, }): Promise<ReturnChatGroupDTO>;
    deleteChatGroup({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}) : Promise<any>;
    getChatGroup({id} : {id:mongoose.Types.ObjectId}): Promise<any>;
    getChatGroupDetails({chatGroups} : {chatGroups:mongoose.Types.ObjectId[]}): Promise<any>;
    getChatGroupsUsers({chatGroupId} : {chatGroupId:mongoose.Types.ObjectId}): Promise<any>;
    addUserToChatGroup({chatGroupId, userId } : {chatGroupId:mongoose.Types.ObjectId, userId:mongoose.Types.ObjectId}): Promise<ReturnChatGroupDTO>;
    removeUserFromChatGroup({chatGroupId,userId } : {chatGroupId:mongoose.Types.ObjectId, userId:mongoose.Types.ObjectId}): Promise<any>;
    updateChatGroupName({chatGroupId, chatGroupName}:{chatGroupId: mongoose.Types.ObjectId, chatGroupName: string}): Promise<any>;
    
}