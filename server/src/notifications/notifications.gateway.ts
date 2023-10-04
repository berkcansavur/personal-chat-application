import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
 } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, AddFriendNotificationDto, RemoveFriendNotificationDto, AddedToChatGroupNotificationDto, RemovedFromChatGroupNotificationDto } from './dto/create-notification.dto';
import { Server, Socket } from 'socket.io';

  @WebSocketGateway({
  cors:{
    origin:'*',
  }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server : Server;

  constructor(
    private readonly notificationsService : NotificationsService
    ) {}

  @SubscribeMessage('addFriendNotification')
  async addFriendNotification(
    @MessageBody() addFriendNotificationDto : AddFriendNotificationDto
    ) {
      const { notificationsService } = this;

      const { UserToBeAdded} = addFriendNotificationDto;

      const notification = await notificationsService.createAddedByFriendNotification({addFriendNotificationDto});
      
      this.server.to(UserToBeAdded).emit('addFriend', notification);

      return notification;
  }
  @SubscribeMessage('removeFriendNotification')
  async removeFriendNotification(
    @MessageBody() removeFriendNotificationDto : RemoveFriendNotificationDto
    ) {
      const { notificationsService } = this;

      const { UserToBeRemoved } = removeFriendNotificationDto;

      const notification = await notificationsService.createRemovedByFriendNotification({removeFriendNotificationDto});

      this.server.to(UserToBeRemoved).emit('removeFriend', notification);

      return notification;
  }
  @SubscribeMessage('addedToChatGroupNotification')
  async addedToChatGroupNotification(
    @MessageBody() addedToChatGroupNotificationDto: AddedToChatGroupNotificationDto
  ){
    const { notificationsService } = this;

    const { UserToBeAdded } = addedToChatGroupNotificationDto;

    const notification = await notificationsService.createAddedToChatGroupNotification({addedToChatGroupNotificationDto});

    this.server.to(UserToBeAdded).emit('addedToChatGroup', notification);

    return notification;
  }
  @SubscribeMessage('removedFromChatGroupNotification')
  async removedFromChatGroupNotification(
    @MessageBody() removedFromChatGroupNotificationDto: RemovedFromChatGroupNotificationDto
  ){
    const { notificationsService } = this;

    const { UserToBeRemoved } = removedFromChatGroupNotificationDto;

    const notification = await notificationsService.createRemovedFromChatGroupNotification({removedFromChatGroupNotificationDto});

    this.server.to(UserToBeRemoved).emit('removedFromChatGroup', notification);

    return notification;
  }
  @SubscribeMessage('createNotification')
  createNotification(
    @MessageBody() createNotificationDto: CreateNotificationDto
    ) {
      const { UserIdToBeNotified, socketId} = createNotificationDto;
      this.server.in(socketId).socketsJoin( UserIdToBeNotified );
  }
  
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Socket connected for Notification: ${socket.id}`)
  }
  async handleDisconnect(socket: Socket): Promise<void> {
    console.log(`Socket disconnected for Notification: ${socket.id}`)
  }
}
