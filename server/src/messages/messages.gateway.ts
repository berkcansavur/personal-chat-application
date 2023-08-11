import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

import { Server,Socket } from 'socket.io';
import { JoinChatGroupDTO } from './dto/join-chatgroup.dto';
import { UsersService } from 'src/users/users.service';
@WebSocketGateway({
  cors:{
    origin:'*',
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server:Server
  constructor(
    private readonly messagesService: MessagesService,
    private readonly userService: UsersService) {}

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
    @MessageBody() payload: { chatGroupID: string },
    @ConnectedSocket() client:Socket) {
      const { chatGroupID } = payload;
      return this.messagesService.identify(chatGroupID, client);
  }
  @SubscribeMessage('typing')
  async typing( 
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket){
      const senderUserName = await this.messagesService.getClientName(client.id);
      client.broadcast.emit( 'typing', { senderUserName,isTyping } );
  }

}
