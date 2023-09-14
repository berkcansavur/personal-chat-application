import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { UsersModule } from 'src/users/users.module';
import { ChatGroupsModule } from 'src/chat-groups/chat-groups.module';

@Module({
  imports:[
    UsersModule,
    ChatGroupsModule
  ],
  providers: [
    NotificationsGateway, 
    NotificationsService
  ],
  exports:[
    NotificationsGateway,
    NotificationsService
  ]
})
export class NotificationsModule {}
