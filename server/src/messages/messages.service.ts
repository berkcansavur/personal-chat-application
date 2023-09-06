import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessagesRepository } from './messages.repository';
@Injectable()
export class MessagesService {
  constructor(
    private messagesRepository: MessagesRepository){}
    private readonly connectedClients: Map<string, Socket> = new Map();
  async create(chatGroupID: string, senderUser: string, text: string) {
    return await this.messagesRepository.create(chatGroupID, senderUser, text);
  }
  identify(chatGroupId: string, socket:Socket) {
    this.connectedClients.set(chatGroupId, socket);
  }
  async getLast20Message(chatGroupID:string){
    return await this.messagesRepository.getLastMessages(chatGroupID, 20);
  }

}
