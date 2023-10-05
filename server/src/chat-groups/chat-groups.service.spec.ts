import { Test, TestingModule } from '@nestjs/testing';
import { ChatGroupsService } from './chat-groups.service';
import { AppModule } from '../app.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGroupsProfile } from '../mapper/chat-groups-mapper';
import { ChatGroupsRepository } from './chat-groups.repository';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { ChatGroupsSchema } from './chat-groups.model';

describe('ChatGroupsService', () => {
  let service: ChatGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AppModule,
        UsersModule,
        MongooseModule.forFeature([{name:'ChatGroups', schema:ChatGroupsSchema}]),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        ChatGroupsService,
        ChatGroupsRepository,
        ChatGroupsProfile
      ],
    }).compile();

    service = module.get<ChatGroupsService>(ChatGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
