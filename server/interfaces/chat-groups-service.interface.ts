import { 
    ReturnChatGroupDTO,
    CreateChatGroupDTO,
    ChatGroupInfoDTO, 
    UpdateChatGroupsNameDTO} from "src/chat-groups/dtos/chat-group-dtos";

export interface IChatGroupService {
    createChatGroup({createChatGroupDTO}:{createChatGroupDTO: CreateChatGroupDTO, }): Promise<ReturnChatGroupDTO>;
    deleteChatGroup({chatGroupId} : {chatGroupId: string}) : Promise<any>;
    getChatGroup({chatGroupId} : {chatGroupId: string}): Promise<ChatGroupInfoDTO>;
    getChatGroupDetails({chatGroups} : {chatGroups:string[]}): Promise<ChatGroupInfoDTO[]>;
    getChatGroupByStringId({chatGroupId}:{chatGroupId: string}): Promise<ChatGroupInfoDTO>;
    getChatGroupsUsers({chatGroupId} : {chatGroupId:string}): Promise<string[]>;
    addUserToChatGroup({chatGroupId, userId } : {chatGroupId:string, userId:string}): Promise<ChatGroupInfoDTO>;
    removeUserFromChatGroup({chatGroupId,userId } : {chatGroupId:string, userId:string}): Promise<ChatGroupInfoDTO>;
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