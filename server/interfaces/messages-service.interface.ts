import mongoose from "mongoose"
import { MessageDTO } from '../src/messages/dto/message.dto';

export interface IMessagesService {
    create({messageDto}:{messageDto:MessageDTO}): Promise<any>;
    getLast20Messages({chatGroupID}:{chatGroupID:mongoose.Types.ObjectId}): Promise<any>;
}