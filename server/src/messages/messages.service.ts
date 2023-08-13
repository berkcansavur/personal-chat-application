import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel('Messages') private messageModel: Model<Message>){}

  async create(chatGroupID: string, senderUser: string, text: string) {
    const newMessage = new this.messageModel({ 
      chatGroup: chatGroupID,
      senderUser: senderUser,
      text:text });
    return await newMessage.save();
  }

  findAll() {
    return `This action returns all messages`;
  }

}
