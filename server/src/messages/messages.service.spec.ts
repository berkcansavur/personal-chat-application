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
import { MessageDTO } from './dto/message.dto';

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
  describe('createMessage', () => {
    it('should create a message', async () => {
      const testMessageDTO: MessageDTO = {
        chatGroupID:'651dec1e3401959dfa153aca',
        senderUser:'Test Sender User',
        text:'Test Message',
      }
      const message = await service.create({messageDto:testMessageDTO});
      expect(message).toBeDefined();
      expect(message.chatGroup).toBe('651dec1e3401959dfa153aca');
      expect(message.senderUser).toBe('Test Sender User');
      expect(message.text).toBe('Test Message');
    });
  });
  describe('getsLastMessages', () => {
    it('should return messages at least less or equals to 20', async () => {
      const testChatGroupId = '651dec1e3401959dfa153aca';

      const testMessagesList = await service.getLast20Messages({chatGroupID:testChatGroupId});
      expect(testMessagesList).toBeDefined();
      expect(testMessagesList.length).toBeLessThanOrEqual(20);
    });
    it('should return messages related with the correct chatGroupId', async () => {
      const testChatGroupId = '651dec1e3401959dfa153aca';

      const testMessagesList = await service.getLast20Messages({chatGroupID:testChatGroupId});
      expect(testMessagesList).toBeDefined();
      testMessagesList.forEach((message) => {
        expect(message).toBeDefined();
        expect(message.chatGroup).toBe('651dec1e3401959dfa153aca');
      })
    });
  });
});
