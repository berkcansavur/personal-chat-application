import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { AppModule } from '../app.module';
import { UsersModule } from '../users/users.module';
import { ChatGroupsModule } from '../chat-groups/chat-groups.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesSchema } from './entities/message.entity';
import { MessagesRepository } from './messages.repository';

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AppModule,
        UsersModule,
        ChatGroupsModule,
        MongooseModule.forFeature([{name:'Messages',schema:MessagesSchema}]),
      ],
      providers: [
        MessagesGateway,
        MessagesService,
        MessagesRepository,
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
