import { AddFriendNotificationDto, AddedToChatGroupNotificationDto, NotificationDto, RemoveFriendNotificationDto, RemovedFromChatGroupNotificationDto } from "src/notifications/dto/create-notification.dto";

export interface INotificationsService{
    createAddedByFriendNotification( { addFriendNotificationDto } : { addFriendNotificationDto : AddFriendNotificationDto } ) : Promise<NotificationDto>
    createRemovedByFriendNotification( { removeFriendNotificationDto } : { removeFriendNotificationDto : RemoveFriendNotificationDto } ) : Promise<NotificationDto>
    createAddedToChatGroupNotification( { addedToChatGroupNotificationDto } : { addedToChatGroupNotificationDto : AddedToChatGroupNotificationDto }) : Promise<NotificationDto>;
    createRemovedFromChatGroupNotification( { removedFromChatGroupNotificationDto }:{ removedFromChatGroupNotificationDto : RemovedFromChatGroupNotificationDto } ) : Promise<NotificationDto>;
    getLast10NotificationsOfUser( {userId} : { userId : string }) : Promise<any>;
}