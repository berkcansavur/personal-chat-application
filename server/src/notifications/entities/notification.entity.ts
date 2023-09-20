import { Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";

export interface Notification {
    UserIdToBeNotified: string;
    ReturnNotificationMessage: string;
    NotificationType: string;
}
export class ReturnNotification {
    @Prop({type: String})
    UserIdToBeNotified: string;

    @Prop({type: String})
    ReturnNotificationMessage: string;

    @Prop({type: String})
    NotificationType: string;
}
export type ReturnNotificationDocument = ReturnNotification & Document; 
export const NotificationsSchema = new mongoose.Schema({
    UserIdToBeNotified:{type: String},
    ReturnNotificationMessage: {type: String},
    NotificationType: {type: String}
},{timestamps:true});
