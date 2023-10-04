import { Test, TestingModule } from '@nestjs/testing';
import { ChatGroupsService } from './chat-groups.service';

describe('ChatGroupsService', () => {
  let service: ChatGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGroupsService],
    }).compile();

    service = module.get<ChatGroupsService>(ChatGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
