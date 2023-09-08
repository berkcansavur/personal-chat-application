import { Injectable } from "@nestjs/common";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { ReturnUser } from "src/users/users.model";
import { ReturnUserDTO } from "src/users/dtos/return-user.dto";
import { UserProfileInfoDTO } from "src/users/dtos/user-profile-info.dto";
@Injectable()
export class UserProfile extends AutomapperProfile{
    constructor(@InjectMapper() protected readonly mapper: Mapper){
        super(mapper);
    }
    get profile(): MappingProfile {
        return(mapper: Mapper)=>{
            createMap<ReturnUser, ReturnUserDTO>(
                mapper,
                ReturnUser,
                ReturnUserDTO,
                
            )
            createMap<ReturnUser, UserProfileInfoDTO>(
                mapper,
                ReturnUser,
                UserProfileInfoDTO,
                forMember(
                    (destination)=> destination.UserId,
                    mapFrom((source)=> source._id.toString())
                ),
                forMember(
                    (destination)=> destination.UserName,
                    mapFrom((source)=> source.name)
                ),
                forMember(
                    (destination)=> destination.UserEmail,
                    mapFrom((source)=> source.email)
                ),
                forMember(
                    (destination)=> destination.ChatGroups,
                    mapFrom((source)=> source.ChatGroups)
                ),
                forMember(
                    (destination)=> destination.Friends,
                    mapFrom((source)=> source.Friends)
                )
                
            )
        }
    }
}