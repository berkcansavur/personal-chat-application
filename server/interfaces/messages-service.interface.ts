import mongoose from "mongoose"

export interface IMessagesService {
    create({chatGroupID, senderUser, text}:{chatGroupID: string, senderUser: string, text: string}): Promise<any>;
    getLast20Messages({chatGroupID}:{chatGroupID:mongoose.Types.ObjectId}): Promise<any>;
}