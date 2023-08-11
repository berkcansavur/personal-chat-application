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
      const { chatGroup, senderUser, text } = createMessageDto;
  
      // Kullanıcının adını almak için _id'yi kullanabilirsiniz
      const user = await this.userService.findUserById(senderUser);
      const message = await this.messagesService.create(
        chatGroup,
        user.name, 
        text
      );
  
      this.server.emit('message', message);
      return message;
    }


  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }
  @SubscribeMessage('join')
  joinChatRoom(
    @MessageBody('senderUser') senderUser: string, 
    @ConnectedSocket() client:Socket) {
      return this.messagesService.identify(senderUser, client.id);
  }
  @SubscribeMessage('typing')
  async typing( 
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket){
      const senderUserName = await this.messagesService.getClientName(client.id);
      client.broadcast.emit( 'typing', { senderUserName,isTyping } );
  }

  // @SubscribeMessage('findOneMessage')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesService.findOne(id);
  // }

  // @SubscribeMessage('updateMessage')
  // update(@MessageBody() updateMessageDto: UpdateMessageDto) {
  //   return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  // }

  // @SubscribeMessage('removeMessage')
  // remove(@MessageBody() id: number) {
  //   return this.messagesService.remove(id);
  // }
}
