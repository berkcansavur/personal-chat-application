import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Message } from "./entities/message.entity";
import { MessageDTO } from "./dto/message.dto";

@Injectable()
export class MessagesRepository {
    constructor(@InjectModel('Messages') private messageModel: Model<Message>){}
    async create(messageDto:MessageDTO) {
        const newMessage = new this.messageModel({ 
          chatGroup: messageDto.chatGroupID,
          senderUser: messageDto.senderUser,
          text:messageDto.text });
        return await newMessage.save();
      }
    getLastMessages(chatGroupID:mongoose.Types.ObjectId, messageCount:number){
        return this.messageModel
          .find({ chatGroup: chatGroupID })
          .sort({ createdAt: -1 })
          .limit(messageCount)
          .exec();
      }
} 