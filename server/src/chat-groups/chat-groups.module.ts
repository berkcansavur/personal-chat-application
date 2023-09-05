import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatGroupsController } from './chat-groups.controller';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGroupsSchema } from './chat-groups.model';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ChatGroupsRepository } from './chat-groups.repository';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'ChatGroups', schema:ChatGroupsSchema}]),
    UsersModule
  ],
  controllers: [ChatGroupsController],
  providers:[
    ChatGroupsService, 
    ChatGroupsRepository
  ],
  exports:[ChatGroupsService]
})
export class ChatGroupsModule {}
