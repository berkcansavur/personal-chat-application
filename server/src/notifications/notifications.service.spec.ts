import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotificationCouldNotCreatedException } from './exceptions';
import { AddFriendNotificationDto, AddedToChatGroupNotificationDto, RemoveFriendNotificationDto, RemovedFromChatGroupNotificationDto } from './dto/create-notification.dto';
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
        MongooseModule.forFeature([{name: 'Notifications', schema: NotificationsSchema}]),
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
        UserToBeAdded: '651dea3074c5da5ab3983cbc',
        AddedByFriendName: 'testFriendToAdd',
        AddedTime: new Date().toISOString()
      };

      const notification = await service.createAddedByFriendNotification({ addFriendNotificationDto });
      expect(notification).toBeDefined();
      expect(notification.UserIdToBeNotified).toBe('651dea3074c5da5ab3983cbc');
      expect(notification.NotificationType).toBe('AddFriendNotification');
      expect(notification.NotificationState).toBe(100);
    });
  });

  describe('createRemovedByFriendNotification', () => {
    it('should create a notification with status CREATED', async () => {
      const removeFriendNotificationDto: RemoveFriendNotificationDto = {
        UserToBeRemoved: '651dea3074c5da5ab3983cbc',
        RemovedByFriendName: 'testFriendToRemove',
        RemovedTime: new Date().toISOString()
      };

      const notification = await service.createRemovedByFriendNotification({ removeFriendNotificationDto });
      expect(notification).toBeDefined();
      expect(notification.UserIdToBeNotified).toBe('651dea3074c5da5ab3983cbc');
      expect(notification.NotificationType).toBe('RemoveFriendNotification');
      expect(notification.NotificationState).toBe(100);      
    });
  });

  describe('createAddedToChatGroupNotification', () => {
    it('should create a notification with status CREATED', async () => {
      const addedToChatGroupNotificationDto: AddedToChatGroupNotificationDto = {
        UserToBeAdded: '651dea3074c5da5ab3983cbc',
        AddedByFriendName: 'addedToChatGroupTestName',
        AddedToChatGroupName: 'testChatGroupName',
        AddedTime: new Date().toISOString()
      };

      const notification = await service.createAddedToChatGroupNotification({ addedToChatGroupNotificationDto });
      expect(notification).toBeDefined();
      expect(notification.UserIdToBeNotified).toBe('651dea3074c5da5ab3983cbc');
      expect(notification.NotificationType).toBe('AddedToChatGroupNotification');
      expect(notification.NotificationState).toBe(100);
    });
  });
  describe('createRemovedFromChatGroupNotification', () => {
    it('should create a notification with status CREATED', async () => {
      const removedFromChatGroupNotificationDto: RemovedFromChatGroupNotificationDto = {
        UserToBeRemoved: '651dea3074c5da5ab3983cbc',
        RemovedByFriendName: 'addedToChatGroupTestName',
        RemovedFromChatGroupName: 'testChatGroupName',
        RemovedTime: new Date().toISOString()
      };

      const notification = await service.createRemovedFromChatGroupNotification({ removedFromChatGroupNotificationDto });
      expect(notification).toBeDefined();
      expect(notification.UserIdToBeNotified).toBe('651dea3074c5da5ab3983cbc');
      expect(notification.NotificationType).toBe('RemovedFromChatGroupNotification');
      expect(notification.NotificationState).toBe(100);
    });
  });
  describe('getLast10NotificationsOfUser', () => {
    it('should return at least 10 notificaitons', async () => {
      const testUserId = '651dea3074c5da5ab3983cbc';
      const last10Notifications = await service.getLast10NotificationsOfUser({userId:testUserId});
      expect(last10Notifications).toBeDefined();
      expect(last10Notifications.length).toBeLessThanOrEqual(10);
      
    })
  });

});
