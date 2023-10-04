import { Test, TestingModule } from '@nestjs/testing';
import { ChatGroupsController } from './chat-groups.controller';

describe('ChatGroupsController', () => {
  let controller: ChatGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatGroupsController],
    }).compile();

    controller = module.get<ChatGroupsController>(ChatGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
