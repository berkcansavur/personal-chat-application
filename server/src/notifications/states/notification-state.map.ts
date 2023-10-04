import { Type } from "@nestjs/common";
import { NOTIFICATION_STATUSES } from "../constants/notification.constant";
import { INotificationState } from "../interfaces/notification-state.interface";
import { NotificaitonCreatedState } from "./created-state";
import { NotificaitonNewState } from "./new-state";
import { NotificaitonViewedState } from "./viewed-state";

export const NotificationStateMap = {
    provide:'NOTIFICATION_STATE',
    useValue: {
        [NOTIFICATION_STATUSES.CREATED]: NotificaitonCreatedState,
        [NOTIFICATION_STATUSES.NEW]: NotificaitonNewState,
        [NOTIFICATION_STATUSES.VIEWED]: NotificaitonViewedState
    } as Record<NOTIFICATION_STATUSES, Type<INotificationState>>
}