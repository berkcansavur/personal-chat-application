import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto, AddFriendNotificationDto, ReturnAddFriendNotificationDto, RemoveFriendNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationsService } from 'interfaces/notification-service.interface';
import { Notification } from './entities/notification.entity';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationsService implements INotificationsService {
  private readonly logger =  new Logger(NotificationsService.name);

  constructor(
  ){}
  private readonly connectedClients: Map<string, Socket> = new Map();
  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
  createAddedByFriendNotification({
    addFriendNotificationDto
  }:{
    addFriendNotificationDto:AddFriendNotificationDto
  }){
    const { logger } = this;
    const {
      UserToBeAdded,
      AddedByFriendName,
      AddedTime
    } = addFriendNotificationDto;
    const returnMessage:string =  `${AddedByFriendName} added you as a friend at: ${AddedTime}`;
    const returnDTO = new ReturnAddFriendNotificationDto();
    returnDTO.UserIdToBeNotified = UserToBeAdded;
    returnDTO.ReturnNotificationMessage = returnMessage;
    returnDTO.NotificationType = 'AddFriendNotification';
    logger.debug(`[NotificationsService] createAddedByFriendNotification: ${JSON.stringify(addFriendNotificationDto)}`)
    
    return returnDTO;

  }
  createRemovedByFriendNotification({
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
    const returnMessage:string =  `${RemovedByFriendName} removed you from friends at: ${RemovedTime}`;
    const returnDTO = new ReturnAddFriendNotificationDto();
    returnDTO.UserIdToBeNotified = UserToBeRemoved;
    returnDTO.ReturnNotificationMessage = returnMessage;
    returnDTO.NotificationType = 'AddFriendNotification';
    logger.debug(`[NotificationsService] createRemovedByFriendNotification: ${JSON.stringify(removeFriendNotificationDto)}`)
    
    return returnDTO;

  }
}
