import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer, 
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server,Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { UserInterfaceForMessaging } from '../../interfaces/chat-groups-service.interface';
import { ChatGroupsService } from 'src/chat-groups/chat-groups.service';
import mongoose from 'mongoose';
import { MessageDTO } from './dto/message.dto';

  @WebSocketGateway({
  cors:{
    origin:'*',
  }
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server:Server 
  
  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService) {}

    @SubscribeMessage('createMessage')
    async create(@MessageBody() createMessageDto: CreateMessageDto) {
      const { chatGroupID, senderUser, text } = createMessageDto;
      const user = await this.userService.findUser({userId:senderUser});
      const messageDto = new MessageDTO()
      messageDto.chatGroupID = chatGroupID;
      messageDto.senderUser = user.UserName;
      messageDto.text = text;
      const message = await this.messagesService.create({messageDto});
  
      this.server.to(chatGroupID.toString()).emit('message', message);
      return message;
    }
    @SubscribeMessage('join')
    async joinChatRoom(
      @MessageBody() payload: { chatGroupID: string, user:UserInterfaceForMessaging }) {
        const { chatGroupID, user } = payload;
        const { socketId } = user;
        this.server.in(socketId).socketsJoin(chatGroupID);
    }
    @SubscribeMessage('events')
    async manageEvents(@MessageBody() payload:{ eventName: string, socketId:string}){
      const { socketId, eventName } = payload;
      this.server.in(socketId).socketsJoin(eventName);
    }
    @SubscribeMessage('searchUser')
    async searchUser(@MessageBody() payload:{searchText: string}){
      const { searchText } = payload;
      const users = await this.userService.searchUser( {searchText: searchText} );
      this.server.to('searchUserEvent').emit('searchUser', users  );
      return users;
    }
    async handleConnection(socket: Socket): Promise<void> {
      console.log(`Socket connected: ${socket.id}`)
    }
    async handleDisconnect(socket: Socket): Promise<void> {
      console.log(`Socket disconnected: ${socket.id}`)
    }
    
}
