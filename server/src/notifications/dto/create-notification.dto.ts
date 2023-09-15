import mongoose from "mongoose";

export class CreateNotificationDto {
    socketId: string;
    UserIdToBeNotified: string;
    NotificationType: string;
};


export class AddFriendNotificationDto {
    UserToBeAdded : string;
    AddedByFriendName: string;
    AddedTime: String;
};
export class RemoveFriendNotificationDto {
    UserToBeRemoved : string;
    RemovedByFriendName: string;
    RemovedTime: String;
};

export class ReturnAddFriendNotificationDto {
    UserIdToBeNotified: string;
    ReturnNotificationMessage: string;
    NotificationType: string;
}
export class NotificationDto {
    UserIdToBeNotified: String;
    ReturnNotificationMessage: string;
    NotificationType: string;
}