
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

export class AddedToChatGroupNotificationDto {
    UserToBeAdded : string;
    AddedByFriendName: string;
    AddedToChatGroupName: string;
    AddedTime: String;
};

export class RemovedFromChatGroupNotificationDto {
    UserToBeRemoved : string;
    RemovedByFriendName: string;
    RemovedFromChatGroupName: string;
    RemovedTime: String;
};

export class RemoveFriendNotificationDto {
    UserToBeRemoved : string;
    RemovedByFriendName: string;
    RemovedTime: String;
};

export class NotificationDto {
    UserIdToBeNotified: String;
    ReturnNotificationMessage: string;
    NotificationType: string;
}