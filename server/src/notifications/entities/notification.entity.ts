import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { NOTIFICATION_STATUSES } from "../constants/notification.constant";

export interface Notification {
    UserIdToBeNotified: string;
    ReturnNotificationMessage: string;
    NotificationType: string;
    NotificationState: number;
}
export class ReturnNotification {
    @Prop({type: String})
    UserIdToBeNotified: string;

    @Prop({type: String})
    ReturnNotificationMessage: string;

    @Prop({type: String})
    NotificationType: string;

    @Prop({type: Number, enum: NOTIFICATION_STATUSES, default: NOTIFICATION_STATUSES.CREATED, required: true})
    NotificationState: number;
}
export type ReturnNotificationDocument = ReturnNotification & Document; 
export const NotificationsSchema = new mongoose.Schema({
    UserIdToBeNotified:{type: String},
    ReturnNotificationMessage: {type: String},
    NotificationType: {type: String},
    NotificationState: {type: Number},
},{timestamps:true});
