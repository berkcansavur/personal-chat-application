import { Inject, Injectable, Logger } from '@nestjs/common';
import { AddFriendNotificationDto, RemoveFriendNotificationDto, NotificationDto, AddedToChatGroupNotificationDto, RemovedFromChatGroupNotificationDto } from './dto/create-notification.dto';

import { INotificationsService } from 'interfaces/notification-service.interface';
import {  ReturnNotification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { NotificationCouldNotCreatedException, NotificationNotFoundException } from './exceptions';
import { NotificationStateFactory } from './factories/notification-state.factory';
import { NOTIFICATION_STATUSES } from './constants/notification.constant';

@Injectable()
export class NotificationsService implements INotificationsService {
  private readonly logger =  new Logger( NotificationsService.name );

  constructor( 
    private notificationsRepository: NotificationsRepository,
    //@Inject('NOTIFICATION_STATE_FACTORY') private readonly notificationStateFactory: NotificationStateFactory,
    @InjectMapper() private readonly NotificationsMapper: Mapper
  ){}
  
  async createAddedByFriendNotification({
    addFriendNotificationDto
  }:{
    addFriendNotificationDto:AddFriendNotificationDto
  }): Promise<NotificationDto>{

    const { 
      logger, 
      NotificationsMapper
     } = this;
    
    const {
      UserToBeAdded,
      AddedByFriendName,
      AddedTime
    } = addFriendNotificationDto;
    
  
    
    logger.debug(`[NotificationsService] createAddedByFriendNotification: ${JSON.stringify(addFriendNotificationDto)}`)

    const returnMessage:string =  `${AddedByFriendName} added you as a friend at: ${AddedTime}`;

    const notification = await this.notificationsRepository.create({
      UserIdToBeNotified:UserToBeAdded,
      ReturnNotificationMessage:returnMessage,
      NotificationType:'AddFriendNotification',
      NotificationState: NOTIFICATION_STATUSES.CREATED
    });

    if(!notification) {
      throw new NotificationCouldNotCreatedException({addFriendNotificationDto});
    }
    return NotificationsMapper.map<ReturnNotification, NotificationDto>(notification,ReturnNotification,NotificationDto);
  }
  
  
  async createRemovedByFriendNotification({
    removeFriendNotificationDto
  }:{
    removeFriendNotificationDto:RemoveFriendNotificationDto
  }): Promise<NotificationDto>{
    const { 
      logger, 
      NotificationsMapper
     } = this;
    const {
      UserToBeRemoved,
      RemovedByFriendName,
      RemovedTime
    } = removeFriendNotificationDto;

    logger.debug(`[NotificationsService] createRemovedByFriendNotification: ${JSON.stringify(removeFriendNotificationDto)}`)

    const returnMessage : string =  `${RemovedByFriendName} removed you from friends at: ${RemovedTime}`;

    const notification = await this.notificationsRepository.create({
      UserIdToBeNotified:UserToBeRemoved,
      ReturnNotificationMessage:returnMessage,
      NotificationType:'RemoveFriendNotification',
      NotificationState:NOTIFICATION_STATUSES.CREATED
    });

    if(!notification) {
      throw new NotificationCouldNotCreatedException({removeFriendNotificationDto});
    }
    
    return NotificationsMapper.map<ReturnNotification,NotificationDto>(notification,ReturnNotification,NotificationDto);
  }

  async createAddedToChatGroupNotification({
    addedToChatGroupNotificationDto
  }:{
    addedToChatGroupNotificationDto : AddedToChatGroupNotificationDto
    }) : Promise<NotificationDto> {
      const { 
        logger, 
        NotificationsMapper
       } = this;
      const { 
        UserToBeAdded,
        AddedToChatGroupName,
        AddedByFriendName,
        AddedTime 
      } = addedToChatGroupNotificationDto

      logger.debug(`[NotificationsService] createAddedToChatGroupNotification: ${JSON.stringify(addedToChatGroupNotificationDto)}`)

      const returnMessage : string = `${AddedByFriendName} added you to ${AddedToChatGroupName} at ${AddedTime}`;
      
      const notification =  await this.notificationsRepository.create({
        UserIdToBeNotified:UserToBeAdded,
        ReturnNotificationMessage:returnMessage,
        NotificationType:'AddedToChatGroupNotification',
        NotificationState:NOTIFICATION_STATUSES.CREATED
      });
      
      if(!notification) {
        throw new NotificationCouldNotCreatedException({addedToChatGroupNotificationDto});
      }
      
      return NotificationsMapper.map<ReturnNotification, NotificationDto>(notification,ReturnNotification,NotificationDto);

  }

  async createRemovedFromChatGroupNotification({
    removedFromChatGroupNotificationDto
  }:{
    removedFromChatGroupNotificationDto : RemovedFromChatGroupNotificationDto
    }) : Promise<NotificationDto> {
      const { 
        logger, 
        NotificationsMapper
       } = this;
      const { 
        UserToBeRemoved,
        RemovedFromChatGroupName,
        RemovedByFriendName,
        RemovedTime 
      } = removedFromChatGroupNotificationDto

      logger.debug(`[NotificationsService] createAddedToChatGroupNotification: ${JSON.stringify(removedFromChatGroupNotificationDto)}`)

      const returnMessage : string = `${RemovedByFriendName} removed you from ${RemovedFromChatGroupName} at ${RemovedTime}`;
      
      const notification =  await this.notificationsRepository.create({
        UserIdToBeNotified:UserToBeRemoved,
        ReturnNotificationMessage:returnMessage,
        NotificationType:'RemovedFromChatGroupNotification',
        NotificationState:NOTIFICATION_STATUSES.CREATED
      });

      if(!notification) {
        throw new NotificationCouldNotCreatedException({removedFromChatGroupNotificationDto});
      }

      return NotificationsMapper.map<ReturnNotification, NotificationDto>(notification,ReturnNotification,NotificationDto);

  }
  async getLast10NotificationsOfUser({
    userId
  }:{
    userId:string
  }) : Promise<NotificationDto[] | null>{

    const { logger } = this;

    logger.debug(`[NotificationsService] getLast10NotificationsOfUser: ${JSON.stringify(userId)}`);
    
    const notifications = await this.notificationsRepository.getLastNotifications(userId,10)
    
    if(!notifications) {
      throw new NotificationNotFoundException({userId});
    }
    
    return notifications;
  }
  
}
