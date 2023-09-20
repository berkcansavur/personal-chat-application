import { Mapper, MappingProfile, createMap, forMember, mapFrom } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { ReturnNotification, ReturnNotificationDocument } from '../notifications/entities/notification.entity';
import { NotificationDto } from "src/notifications/dto/create-notification.dto";

@Injectable()
export class NotificationProfile extends AutomapperProfile{
    constructor(@InjectMapper() protected readonly mapper: Mapper){
        super(mapper);
    }
    get profile(): MappingProfile {
        return (mapper: Mapper) => {
            createMap<ReturnNotification,NotificationDto>(
                mapper,
                ReturnNotification,
                NotificationDto,
                forMember(
                    (destination) => destination.UserIdToBeNotified,
                    mapFrom((source)=> source.UserIdToBeNotified)
                ),
                forMember(
                    (destination) => destination.ReturnNotificationMessage,
                    mapFrom((source)=> source.ReturnNotificationMessage)
                ),
                forMember(
                    (destination) => destination.NotificationType,
                    mapFrom((source)=> source.NotificationType)
                )
            )
        }
    }
}