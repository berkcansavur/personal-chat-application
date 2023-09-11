import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ReturnChatGroup } from "src/chat-groups/chat-groups.model";

import { 
    ReturnChatGroupDTO,
    ChatGroupInfoDTO } from "src/chat-groups/dtos/chat-group-dtos";

@Injectable()
export class ChatGroupsProfile extends AutomapperProfile{
    constructor(@InjectMapper() protected readonly mapper: Mapper){
        super(mapper);
    }
    get profile(): MappingProfile {
        return(mapper: Mapper)=>{
            createMap<ReturnChatGroup, ReturnChatGroupDTO >(
                mapper,
                ReturnChatGroup,
                ReturnChatGroupDTO,
                forMember(
                    (destination)=> destination._id,
                    mapFrom((source)=>source._id.toString())
                ),
                forMember(
                    (destination)=>destination.chatGroupName,
                    mapFrom((source)=>source.chatGroupName)
                ),
                forMember(
                    (destination)=> destination.users,
                    mapFrom((source)=>source.users)
                )
            ),
            createMap<ReturnChatGroupDTO,ChatGroupInfoDTO>(
                mapper,
                ReturnChatGroupDTO,
                ChatGroupInfoDTO,
                forMember(
                    (destination)=> destination._id.toString(),
                    mapFrom((source)=>source._id)
                ),
                forMember(
                    (destination)=>destination.chatGroupName,
                    mapFrom((source)=>source.chatGroupName)
                ),
                forMember(
                    (destination)=> destination.users,
                    mapFrom((source)=>source.users)
                )
            )
            createMap<ReturnChatGroup,ChatGroupInfoDTO>(
                mapper,
                ReturnChatGroup,
                ChatGroupInfoDTO,
                forMember(
                    (destination)=> destination._id,
                    mapFrom((source)=>source._id)
                ),
                forMember(
                    (destination)=>destination.chatGroupName,
                    mapFrom((source)=>source.chatGroupName)
                ),
                forMember(
                    (destination)=> destination.users,
                    mapFrom((source)=>source.users)
                )
            )
        }
    }
}