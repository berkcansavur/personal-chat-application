import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsSchema } from './entities/notification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProfile } from '../mapper/notification-mapper';
import { NotificationStateFactory } from './factories/notification-state.factory';
import { NotificationStateMap } from './states/notification-state.map';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Notifications',schema:NotificationsSchema}])
  ],
  providers: [
    NotificationsGateway, 
    NotificationsService,
    NotificationsRepository,
    NotificationProfile,
    NotificationStateMap,
    {
      provide:'NOTIFICATION_STATE_FACTORY',
      useClass: NotificationStateFactory
    }
  ],
  exports:[
    NotificationsGateway,
    NotificationsService
  ]
})
export class NotificationsModule {}
