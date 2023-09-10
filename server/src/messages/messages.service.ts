import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessagesRepository } from './messages.repository';
import mongoose from 'mongoose';
import { IMessagesService } from 'interfaces/messages-service.interface';
import { MessageDTO } from './dto/message.dto';
@Injectable()
export class MessagesService implements IMessagesService {
  constructor(
    private messagesRepository: MessagesRepository){}
    private readonly connectedClients: Map<string, Socket> = new Map();
  async create({messageDto}: {messageDto:MessageDTO}) {
    return await this.messagesRepository.create(messageDto);
    
  }
  identify({chatGroupId,socket}:{chatGroupId: string, socket:Socket}) {
    this.connectedClients.set(chatGroupId, socket);
  }
  async getLast20Messages({chatGroupID}:{chatGroupID:mongoose.Types.ObjectId}){
    return await this.messagesRepository.getLastMessages(chatGroupID, 20);
  }

}
