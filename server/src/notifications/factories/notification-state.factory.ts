import { Inject, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { NOTIFICATION_STATUSES } from "../constants/notification.constant";
import { INotificationState } from "../interfaces/notification-state.interface";
import { INotificationStateFactory } from "../interfaces/notification-state-factory.interface";


@Injectable()
export class NotificationStateFactory implements INotificationStateFactory {
    constructor(
        private readonly moduleRef: ModuleRef,
        @Inject('NOTIFICATION_STATE') private readonly stateMap: Record<NOTIFICATION_STATUSES, Type<INotificationState>>
    ){}
    async getState(state: NOTIFICATION_STATUSES): Promise<INotificationState> {
        const { stateMap } = this;
        const StateClass = stateMap[state];
        if(StateClass) {
            return this.moduleRef.create<INotificationState>(StateClass);
        }
        throw new Error('Invalid State');

    }
}