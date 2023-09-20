import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto, AddFriendNotificationDto, ReturnAddFriendNotificationDto, RemoveFriendNotificationDto, NotificationDto } from './dto/create-notification.dto';

import { INotificationsService } from 'interfaces/notification-service.interface';
import { Notification, ReturnNotification } from './entities/notification.entity';
import { Socket } from 'socket.io';
import { NotificationsRepository } from './notifications.repository';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class NotificationsService implements INotificationsService {
  private readonly logger =  new Logger(NotificationsService.name);
  private readonly connectedClients = new Map<string, Socket>();

  constructor( 
    private notificationsRepository: NotificationsRepository,
    @InjectMapper() private readonly NotificationsMapper: Mapper
  ){}
  
  
  addUserToConnectedList(userId: string, socket: Socket) {
    this.connectedClients.set(userId, socket);
  }

  removeUserFromConnectedList(userId: string) {
      this.connectedClients.delete(userId);
    }

  // notifyFriendAdded(userId: string, friendName: string) {
  //     const socket = this.connectedUsers.get(userId);
  //     if (socket) {
  //       socket.emit('friendAdded', { friendName });
  //     }
  // }

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
      NotificationsMapper } = this;

    const {
      UserToBeAdded,
      AddedByFriendName,
      AddedTime
    } = addFriendNotificationDto;

    logger.debug(`[NotificationsService] createAddedByFriendNotification: ${JSON.stringify(addFriendNotificationDto)}`)

    const returnMessage:string =  `${AddedByFriendName} added you as a friend at: ${AddedTime}`;
    
    const socket = this.connectedClients.get(UserToBeAdded);

    const notification = await this.notificationsRepository.create({
      UserIdToBeNotified:UserToBeAdded,
      ReturnNotificationMessage:returnMessage,
      NotificationType:'AddFriendNotification'
    });
    if (socket) {
      socket.emit('friendAdded', { returnMessage });
    }
    return NotificationsMapper.map<ReturnNotification,NotificationDto>(notification,ReturnNotification,NotificationDto);
  }
  
  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
  
  async createRemovedByFriendNotification({
    removeFriendNotificationDto
  }:{
    removeFriendNotificationDto:RemoveFriendNotificationDto
  }){
    const { logger } = this;
    const {
      UserToBeRemoved,
      RemovedByFriendName,
      RemovedTime
    } = removeFriendNotificationDto;

    logger.debug(`[NotificationsService] createRemovedByFriendNotification: ${JSON.stringify(removeFriendNotificationDto)}`)

    const returnMessage:string =  `${RemovedByFriendName} removed you from friends at: ${RemovedTime}`;

    return await this.notificationsRepository.create({
      UserIdToBeNotified:UserToBeRemoved,
      ReturnNotificationMessage:returnMessage,
      NotificationType:'RemoveFriendNotification'
    });
  }
  async getLast10NotificationsOfUser({userId}:{userId:string}){
    const { logger } = this;
    logger.debug(`[NotificationsService] getLast10NotificationsOfUser: ${JSON.stringify(userId)}`);
    return await this.notificationsRepository.getLastNotifications(userId,10)
  }
  
}
