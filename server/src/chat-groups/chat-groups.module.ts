import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatGroupsController } from './chat-groups.controller';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGroupsSchema } from './chat-groups.model';
import { UsersModule } from 'src/users/users.module';
import { ChatGroupsRepository } from './chat-groups.repository';
import { ChatGroupsProfile } from 'src/mapper/chat-groups-mapper';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'ChatGroups', schema:ChatGroupsSchema}]),
    UsersModule,
    NotificationsModule,
    UtilsModule
  ],
  controllers: [ChatGroupsController],
  providers:[
    ChatGroupsService, 
    ChatGroupsRepository,
    ChatGroupsProfile
  ],
  exports:[ChatGroupsService]
})
export class ChatGroupsModule {}
