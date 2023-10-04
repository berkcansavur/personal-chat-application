import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.model';
import { PassportModule } from '@nestjs/passport';
import { UtilsModule } from '../utils/utils.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersRepository } from './users.repository';
import { UserProfile } from '../mapper/user-mapper';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AppModule,
        PassportModule,
        UtilsModule,
        NotificationsModule,
        MongooseModule.forFeature([{ name:'Users',schema: UserSchema}]),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        UsersService,
        UsersRepository,
        UserProfile,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
