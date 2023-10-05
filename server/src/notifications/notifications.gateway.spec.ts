import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { AppModule } from '../app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomapperModule } from '@automapper/nestjs';
import { NotificationsSchema } from './entities/notification.entity';
import { classes } from '@automapper/classes';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProfile } from '../mapper/notification-mapper';

describe('NotificationsGateway', () => {
  let gateway: NotificationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        AppModule,
        MongooseModule.forFeature([{name:'Notifications',schema:NotificationsSchema}]),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        NotificationsGateway,
        AppModule,
        NotificationsService,
        NotificationsRepository,
        NotificationProfile,
      ],
    }).compile();

    gateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
