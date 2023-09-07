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
import { User  } from '../../shared/chat.interface';
import { ChatGroupsService } from 'src/chat-groups/chat-groups.service';
import mongoose from 'mongoose';

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
    private readonly chatGroupService : ChatGroupsService) {}

    @SubscribeMessage('createMessage')
    async create(@MessageBody() createMessageDto: CreateMessageDto) {
      const { chatGroupID, senderUser, text } = createMessageDto;
      const user = await this.userService.findUser({id:senderUser});
      const message = await this.messagesService.create({chatGroupID:chatGroupID, senderUser: user.name, text:text});
  
      this.server.to(chatGroupID).emit('message', message);
      return message;
    }
    @SubscribeMessage('getFriends')
    async getFriends(@MessageBody() payload:{ userId:mongoose.Types.ObjectId,}) {
      const { userId } = payload;
      const friends = await this.userService.getFriendsOfUser({userId});
      const friendsData = [];
      for( const friend of friends ) {
        const friendData = await this.userService.getUserData( {userObject:friend} );
        friendsData.push( friendData );
      }
      this.server.to('getFriendEvent').emit('getFriends', friendsData );
      return friendsData ;
    }
    @SubscribeMessage('searchUser')
    async searchUser(@MessageBody() payload:{searchText: string}){
      const { searchText } = payload;
      const users = await this.userService.searchUser( {searchText: searchText} );
      this.server.to('searchUserEvent').emit('searchUser', users  );
      return users;
    }
    @SubscribeMessage('getChatGroupUsers')
    async getChatGroupUsers(@MessageBody() payload:{chatGroupId: mongoose.Types.ObjectId}){
      const { chatGroupId } = payload;
      const friends = await this.chatGroupService.getChatGroupsUsers({chatGroupId: chatGroupId});
      const friendsData = [];
      for( const friend of friends ) {
        const friendData = await this.userService.getUserData( {userObject:friend} );
        friendsData.push( friendData );
      }
      this.server.to('getChatGroupUsersEvent').emit('getChatGroupUsers', friendsData  );
      return friendsData;
    }
    @SubscribeMessage('events')
    async manageEvents(@MessageBody() payload:{ eventName: string, socketId:string}){
      const { socketId, eventName } = payload;
      await this.server.in(socketId).socketsJoin(eventName);
    }
    @SubscribeMessage('join')
    async joinChatRoom(
      @MessageBody() payload: { chatGroupID: string, user:User }) {
        const { chatGroupID, user } = payload;
        const { socketId } = user;
        await this.server.in(socketId).socketsJoin(chatGroupID);
    }
    async handleConnection(socket: Socket): Promise<void> {
      console.log(`Socket connected: ${socket.id}`)
    }
    async handleDisconnect(socket: Socket): Promise<void> {
      console.log(`Socket disconnected: ${socket.id}`)
    }
    
}
