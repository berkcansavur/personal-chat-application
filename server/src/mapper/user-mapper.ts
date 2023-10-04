import { Injectable } from "@nestjs/common";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { ReturnUser, ReturnUserProfile, ReturnUserToBeAuth, UserToBeValidate } from "../users/users.model";
import { 
    UserToBeValidateDTO,
    UserProfileInfoDTO,
    ReturnUserDTO,
    FriendInfoDTO,
    MapUserInfoDTO,
    AuthenticatedUserDTO
 } from "../users/dtos/user-dtos";
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
            createMap<UserToBeValidate, UserToBeValidateDTO>(
                mapper,
                UserToBeValidate,
                UserToBeValidateDTO,
                forMember(
                    (destination)=> destination._id,
                    mapFrom((source)=> source._id.toString())
                ),
                forMember(
                    (destination)=> destination.email,
                    mapFrom((source)=> source.email)
                ),
                forMember(
                    (destination)=> destination.password,
                    mapFrom((source)=> source.password)
                )
            ),
            createMap<UserProfileInfoDTO, ReturnUserProfile>(
                mapper,
                UserProfileInfoDTO,
                ReturnUserProfile,
                forMember(
                    (destination)=>destination._id,
                    mapFrom((source)=>source.UserId)
                ),
                forMember(
                    (destination)=>destination.name,
                    mapFrom((source)=>source.UserName)
                ),
                forMember(
                    (destination)=>destination.email,
                    mapFrom((source)=>source.UserEmail)
                ),
                forMember(
                    (destination)=>destination.ChatGroups,
                    mapFrom((source)=>source.ChatGroups)
                ),
                forMember(
                    (destination)=>destination.Friends,
                    mapFrom((source)=>source.Friends)
                )
            )
            createMap<MapUserInfoDTO, ReturnUserProfile>(
                mapper,
                MapUserInfoDTO,
                ReturnUserProfile,
                forMember(
                    (destination)=>destination._id,
                    mapFrom((source)=>source.UserId)
                ),
                forMember(
                    (destination)=>destination.name,
                    mapFrom((source)=>source.UserName)
                ),
                forMember(
                    (destination)=>destination.email,
                    mapFrom((source)=>source.UserEmail)
                ),
                forMember(
                    (destination)=>destination.ChatGroups,
                    mapFrom((source)=>source.ChatGroupDetails)
                ),
                forMember(
                    (destination)=>destination.Friends,
                    mapFrom((source)=>source.FriendsData)
                )
            )
            createMap<ReturnUser, UserProfileInfoDTO>(
                mapper,
                ReturnUser,
                UserProfileInfoDTO,
                forMember(
                    (destination)=> destination.UserId,
                    mapFrom((source)=> source._id)
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
            createMap<ReturnUser, FriendInfoDTO>(
                mapper,
                ReturnUser,
                FriendInfoDTO,
                forMember(
                    (destination)=> destination._id,
                    mapFrom((source)=> source._id)
                ),
                forMember(
                    (destination)=> destination.name,
                    mapFrom((source)=> source.name)
                ),
                forMember(
                    (destination)=> destination.email,
                    mapFrom((source)=> source.email)
                )
            )
            createMap<ReturnUserToBeAuth,AuthenticatedUserDTO>(
                mapper,
                ReturnUserToBeAuth,
                AuthenticatedUserDTO,
                forMember(
                    (destination)=> destination.access_token,
                    mapFrom((source)=> source.accessToken)
                ),
                forMember(
                    (destination)=> destination.userId,
                    mapFrom((source)=> source._id.toString())
                ),
                forMember(
                    (destination)=> destination.userName,
                    mapFrom((source)=> source.name)
                ),
                forMember(
                    (destination)=> destination.userEmail,
                    mapFrom((source)=> source.email)
                )
            )
        }
    }
}