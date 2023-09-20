import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatGroupsModule } from 'src/chat-groups/chat-groups.module';
import { NotificationsSchema } from './entities/notification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProfile } from 'src/mapper/notification-mapper';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Notifications',schema:NotificationsSchema}])
  ],
  providers: [
    NotificationsGateway, 
    NotificationsService,
    NotificationsRepository,
    NotificationProfile
  ],
  exports:[
    NotificationsGateway,
    NotificationsService
  ]
})
export class NotificationsModule {}
