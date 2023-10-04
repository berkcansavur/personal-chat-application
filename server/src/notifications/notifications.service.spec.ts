import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationCouldNotCreatedException } from './exceptions';
import { AddFriendNotificationDto } from './dto/create-notification.dto';
import { NOTIFICATION_STATUSES } from './constants/notification.constant';
import { NotificationsRepository } from './notifications.repository';
import { NotificationProfile } from '../mapper/notification-mapper';
import { NotificationsGateway } from './notifications.gateway';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsSchema } from './entities/notification.entity';
import { AppModule } from '../app.module';
import { NotificationsModule } from './notifications.module';

describe('NotificationsService', () => {
  let service: NotificationsService;

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
        NotificationsService,
        NotificationsRepository,
        NotificationProfile,
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  describe('createAddedByFriendNotification', () => {
    it('should create a notification with status CREATED', async () => {
      const addFriendNotificationDto: AddFriendNotificationDto = {
        UserToBeAdded: 'user123',
        AddedByFriendName: 'friendName',
        AddedTime: new Date().toISOString()
      };

      const notification = await service.createAddedByFriendNotification({ addFriendNotificationDto });
      expect(notification).toBeDefined();
      expect(notification.UserIdToBeNotified).toBe('user123');
      expect(notification.NotificationType).toBe('AddFriendNotification');
      expect(notification.NotificationState).toBe(100);

      
    });
    it('should create a notification', async () => {
      const addFriendNotificationDto: AddFriendNotificationDto = {
        UserToBeAdded: 'user123',
        AddedByFriendName: 'friendName',
        AddedTime: new Date().toISOString()
      };

      const notification = await service.createAddedByFriendNotification({ addFriendNotificationDto }).then((res)=>{
        expect(res).toBeDefined();
        expect(res.UserIdToBeNotified).toBe('user123');
        expect(res.NotificationType).toBe('AddFriendNotification');
      });
    });
  });

});
