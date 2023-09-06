import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "./entities/message.entity";

@Injectable()
export class MessagesRepository {
    constructor(@InjectModel('Messages') private messageModel: Model<Message>){}
    async create(chatGroupID: string, senderUser: string, text: string) {
        const newMessage = new this.messageModel({ 
          chatGroup: chatGroupID,
          senderUser: senderUser,
          text:text });
        return await newMessage.save();
      }
    getLastMessages(chatGroupID:string, messageCount:number){
        return this.messageModel
          .find({ chatGroup: chatGroupID })
          .sort({ createdAt: -1 })
          .limit(messageCount)
          .exec();
      }
}   