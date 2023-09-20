import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificationDto } from "./dto/create-notification.dto";
import { Notification, ReturnNotificationDocument } from "./entities/notification.entity";
@Injectable()
export class NotificationsRepository {
    constructor( @InjectModel('Notifications') private notificationsModel: Model<Notification>){}

    async create(notificationDto: NotificationDto) : Promise<ReturnNotificationDocument>{
        const newNotification = new this.notificationsModel({
            UserIdToBeNotified: notificationDto.UserIdToBeNotified,
            ReturnNotificationMessage: notificationDto.ReturnNotificationMessage,
            NotificationType:notificationDto.NotificationType});
        return (await newNotification.save()).toObject();
    }
    getLastNotifications(userId: string, notificationCount:number){
        return this.notificationsModel
        .find({UserIdToBeNotified: userId})
        .sort({createdAt: -1})
        .limit(notificationCount)
        .exec();
    }
    
}