import { Inject, Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Server, Socket } from 'socket.io';
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Messages') private messageModel: Model<Message>){}
    private readonly connectedClients: Map<string, Socket> = new Map();
  async create(chatGroupID: string, senderUser: string, text: string) {
    const newMessage = new this.messageModel({ 
      chatGroup: chatGroupID,
      senderUser: senderUser,
      text:text });
    return await newMessage.save();
  }
  identify(chatGroupId: string, socket:Socket) {
    this.connectedClients.set(chatGroupId, socket);
  }

  getClientName(clientId:string){
  }

  findAll() {
    return `This action returns all messages`;
  }

}
