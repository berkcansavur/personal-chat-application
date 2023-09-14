import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatGroupsModule } from 'src/chat-groups/chat-groups.module';
import { NotificationsSchema } from './entities/notification.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsRepository } from './notifications.repository';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Notifications',schema:NotificationsSchema}]),
    UsersModule,
    ChatGroupsModule
  ],
  providers: [
    NotificationsGateway, 
    NotificationsService,
    NotificationsRepository
  ],
  exports:[
    NotificationsGateway,
    NotificationsService
  ]
})
export class NotificationsModule {}
