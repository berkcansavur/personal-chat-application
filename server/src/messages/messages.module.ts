import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesSchema } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { MessagesRepository } from './messages.repository';
import { ChatGroupsModule } from 'src/chat-groups/chat-groups.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name:'Messages',schema:MessagesSchema}]),
    UsersModule,
    ChatGroupsModule
  ],
  providers: [
    MessagesGateway,
    MessagesService,
    MessagesRepository
  ],
  exports:[
    MessagesGateway,
    MessagesService
  ]
})
export class MessagesModule {}