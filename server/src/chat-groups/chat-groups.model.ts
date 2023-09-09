import * as mongoose from "mongoose";

export const ChatGroupsSchema = new mongoose.Schema({
    chatGroupName:{type: String, required: true},
    users:[{
        user:{type:Object}
    }],
    createdDate:{type: Date}
},{timestamps:true})

export interface ChatGroups{
    id: number;
    chatGroupName: string;
    users: mongoose.Types.ObjectId[];
    createdDate: Date;
}