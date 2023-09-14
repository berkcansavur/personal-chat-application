import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto, AddFriendNotificationDto, ReturnAddFriendNotificationDto, RemoveFriendNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { INotificationsService } from 'interfaces/notification-service.interface';
import { Notification } from './entities/notification.entity';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService implements INotificationsService {
  private readonly logger =  new Logger(NotificationsService.name);

  constructor( private notificationsRepository: NotificationsRepository
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
  async createAddedByFriendNotification({
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

    logger.debug(`[NotificationsService] createAddedByFriendNotification: ${JSON.stringify(addFriendNotificationDto)}`)

    const returnMessage:string =  `${AddedByFriendName} added you as a friend at: ${AddedTime}`;
    
    return await this.notificationsRepository.create({
      UserIdToBeNotified:UserToBeAdded,
      ReturnNotificationMessage:returnMessage,
      NotificationType:'AddFriendNotification'
    });
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
