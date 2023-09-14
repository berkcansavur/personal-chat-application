import mongoose from "mongoose";

export interface Notification {
    UserIdToBeNotified: string;
    ReturnNotificationMessage: string;
    NotificationType: string;
}
export const NotificationsSchema = new mongoose.Schema({
    UserIdToBeNotified:{type: String},
    ReturnNotificationMessage: {type: String},
    NotificationType: {type: String}
},{timestamps:true});
