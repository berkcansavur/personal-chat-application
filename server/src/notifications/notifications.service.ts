import { Injectable, Logger } from '@nestjs/common';
import {  AddFriendNotificationDto, RemoveFriendNotificationDto, NotificationDto, AddedToChatGroupNotificationDto, RemovedFromChatGroupNotificationDto } from './dto/create-notification.dto';

import { INotificationsService } from 'interfaces/notification-service.interface';
import {  ReturnNotification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class NotificationsService implements INotificationsService {
  private readonly logger =  new Logger( NotificationsService.name );

  constructor( 
    private notificationsRepository: NotificationsRepository,
    @InjectMapper() private readonly NotificationsMapper: Mapper
  ){}
  
  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }
  
  async createAddedByFriendNotification({
    addFriendNotificationDto
  }:{
    addFriendNotificationDto:AddFriendNotificationDto
  }){

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
      NotificationType:'AddFriendNotification'
    });

    return NotificationsMapper.map<ReturnNotification, NotificationDto>(notification,ReturnNotification,NotificationDto);
  }
  
  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
  
  async createRemovedByFriendNotification({
    removeFriendNotificationDto
  }:{
    removeFriendNotificationDto:RemoveFriendNotificationDto
  }){
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
      NotificationType:'RemoveFriendNotification'
    });
    return NotificationsMapper.map<ReturnNotification,NotificationDto>(notification,ReturnNotification,NotificationDto);
  }

  async createAddedToChatGroupNotification({
    addedToChatGroupNotificationDto
  }:{
    addedToChatGroupNotificationDto : AddedToChatGroupNotificationDto
    }){
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
        NotificationType:'AddedToChatGroupNotification'
      });
      return NotificationsMapper.map<ReturnNotification, NotificationDto>(notification,ReturnNotification,NotificationDto);

  }

  async createRemovedFromChatGroupNotification({
    removedFromChatGroupNotificationDto
  }:{
    removedFromChatGroupNotificationDto : RemovedFromChatGroupNotificationDto
    }){
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

      const returnMessage : string = `${RemovedByFriendName} added you to ${RemovedFromChatGroupName} at ${RemovedTime}`;
      const notification =  await this.notificationsRepository.create({
        UserIdToBeNotified:UserToBeRemoved,
        ReturnNotificationMessage:returnMessage,
        NotificationType:'AddedToChatGroupNotification'
      });
      return NotificationsMapper.map<ReturnNotification, NotificationDto>(notification,ReturnNotification,NotificationDto);

  }
  async getLast10NotificationsOfUser({
    userId
  }:{
    userId:string
  }){
    const { logger } = this;
    logger.debug(`[NotificationsService] getLast10NotificationsOfUser: ${JSON.stringify(userId)}`);
    return await this.notificationsRepository.getLastNotifications(userId,10)
  }
  
}
