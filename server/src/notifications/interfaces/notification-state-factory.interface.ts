import { NOTIFICATION_STATUSES } from "../constants/notification.constant";
import { INotificationState } from "./notification-state.interface";

export interface INotificationStateFactory {
    getState(state: NOTIFICATION_STATUSES): Promise<INotificationState>;
}