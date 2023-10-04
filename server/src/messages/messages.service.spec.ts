import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomapperModule } from '@automapper/nestjs';
import { MessagesSchema } from './entities/message.entity';
import { classes } from '@automapper/classes';
import { MessagesRepository } from './messages.repository';
import { MessagesGateway } from './messages.gateway';
import { UsersModule } from '../users/users.module';
import { ChatGroupsModule } from '../chat-groups/chat-groups.module';

describe('MessagesService', () => {
  let service: MessagesService;

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

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
