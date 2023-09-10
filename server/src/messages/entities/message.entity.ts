import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Schema as mSchema, Document, Types } from 'mongoose';
export class Message {
    chatGroup: string;
    senderUser: string;
    text: string;
}
export interface Message {
    chatGroup: string;
    senderUser: string;
    text: string;
}
export const MessagesSchema = new mongoose.Schema({
    chatGroup:{type:Object},
    senderUser:{type:Object},
    text: {type:String}
},{timestamps:true});
