import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ReturnChatGroup } from "src/chat-groups/chat-groups.model";
import { ChatGroupInfoDTO } from "src/chat-groups/dtos/chat-group-info.dto";
import { ReturnChatGroupDTO } from "src/chat-groups/dtos/return-chat-groups.dto";

@Injectable()
export class ChatGroupsProfile extends AutomapperProfile{
    constructor(@InjectMapper() protected readonly mapper: Mapper){
        super(mapper);
    }
    get profile(): MappingProfile {
        return(mapper: Mapper)=>{
            createMap<ReturnChatGroup,ReturnChatGroupDTO >(
                mapper,
                ReturnChatGroup,
                ReturnChatGroupDTO
            ),
            createMap<ReturnChatGroupDTO,ChatGroupInfoDTO>(
                mapper,
                ReturnChatGroupDTO,
                ChatGroupInfoDTO,
            )
        }
    }
}