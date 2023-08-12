import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer, 
  ConnectedSocket, 
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server,Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { User  } from '../../shared/chat.interface';
import { ChatGroupsService } from 'src/chat-groups/chat-groups.service';

  @WebSocketGateway({
  cors:{
    origin:'*',
  }
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server:Server 
  
  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService,
    private readonly chatGroupService: ChatGroupsService) {}

    @SubscribeMessage('createMessage')
    async create(@MessageBody() createMessageDto: CreateMessageDto) {
      const { chatGroupID, senderUser, text } = createMessageDto;
      const user = await this.userService.findUserById(senderUser);
      const message = await this.messagesService.create(
        chatGroupID,
        user.name, 
        text
      );
      this.server.to(chatGroupID).emit('message', message);
      return message;
    }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }
  @SubscribeMessage('join')
  async joinChatRoom(
    @MessageBody() payload: { chatGroupID: string, user:User }) {
      const { chatGroupID, user } = payload;
      const { socketId } = user;
      await this.server.in(socketId).socketsJoin(chatGroupID);
  }
  @SubscribeMessage('typing')
  async typing( 
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket){
      const senderUserName = await this.messagesService.getClientName(client.id);
      client.broadcast.emit( 'typing', { senderUserName,isTyping } );
  }
  async handleConnection(socket: Socket): Promise<void> {
    console.log(`Socket connected: ${socket.id}`)
  }
  async handleDisconnect(socket: Socket): Promise<void> {
    console.log(`Socket disconnected: ${socket.id}`)
  }

}
