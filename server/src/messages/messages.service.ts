import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessagesRepository } from './messages.repository';
import mongoose from 'mongoose';
import { IMessagesService } from 'interfaces/messages-service.interface';
import { MessageDTO } from './dto/message.dto';
@Injectable()
export class MessagesService implements IMessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private messagesRepository: MessagesRepository){}

    private readonly connectedClients: Map<string, Socket> = new Map();

  async create({
    messageDto
  }: {
    messageDto:MessageDTO
  }) {
    const { logger } = this;
    logger.debug(`[MessagesService] create: ${JSON.stringify(messageDto)}`);
    return await this.messagesRepository.create(messageDto);
    
  }

  // identify({
  //   chatGroupId,
  //   socket
  // }:{
  //   chatGroupId: string, 
  //   socket:Socket
  // }) {
  //   const { logger } = this;
  //   logger.debug(`[MessagesService] identify: ${JSON.stringify({chatGroupId,socket})}`);
  //   this.connectedClients.set(chatGroupId, socket);
  // }

  async getLast20Messages({
    chatGroupID
  }:{
    chatGroupID:mongoose.Types.ObjectId
  }) {
    const { logger } = this;
    logger.debug(`[MessagesService] getLast20Messages: ${JSON.stringify(chatGroupID)}`);
    return await this.messagesRepository.getLastMessages(chatGroupID, 20);
  }

}
