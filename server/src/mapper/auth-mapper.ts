import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { CurrentUserDTO, UserProfileInfoDTO } from "../users/dtos/user-dtos";

@Injectable()
export class AuthProfile extends AutomapperProfile{
    constructor(@InjectMapper() protected readonly mapper: Mapper){
        super(mapper);
    }
    get profile(): MappingProfile {
        return (mapper: Mapper) => {
            createMap<UserProfileInfoDTO,CurrentUserDTO>(
                mapper,
                UserProfileInfoDTO,
                CurrentUserDTO,
                forMember(
                    (destination)=> destination.userId,
                    mapFrom((source)=> source.UserId)
                ),
                forMember(
                    (destination)=>destination.userName,
                    mapFrom((source)=> source.UserName)
                ),
                forMember(
                    (destination)=>destination.userEmail,
                    mapFrom((source)=> source.UserEmail)
                )
            )
        }
    }
}