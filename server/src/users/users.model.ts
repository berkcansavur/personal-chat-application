import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Schema as mSchema, Document, Types } from 'mongoose';
import { ChatGroupInfoDTO } from 'src/chat-groups/dtos/chat-group-info.dto';
import { FriendInfoDTO } from './dtos/friend-info.dto';
export interface User {
    _id:string; 
    name: string;
    email: string;
    password: string;
    Friends: mongoose.Types.ObjectId[];
    ChatGroups: mongoose.Types.ObjectId[];
}
export class UserEntity{
    id:string;
    name:string;
    email:string;
    password:string;
    Friends: object[];
    ChatGroups:string;
}
export class ReturnUser{
    @Prop({type: mSchema.Types.ObjectId, auto: true})
    _id:Types.ObjectId;

    @Prop({type: String, required: true})
    name:string;

    @Prop({type: String, required: true})
    email:string;

    @Prop({type: []})
    ChatGroups:any[];

    @Prop({type: []})
    Friends:any[];
}
export class UserToBeValidate{
    @Prop({type: mSchema.Types.ObjectId, auto: true})
    _id:Types.ObjectId;

    @Prop({type: String, required: true})
    email:string;

    @Prop({type: String, required: true})
    password:string;
    
}
export class ReturnUserProfile{
    @Prop({type: mSchema.Types.ObjectId, auto: true})
    _id:Types.ObjectId;

    @Prop({type: String, required: true})
    name:string;

    @Prop({type: String, required: true})
    email:string;

    @Prop({type: []})
    ChatGroups:ChatGroupInfoDTO[];

    @Prop({type: []})
    Friends:FriendInfoDTO[];
}
export type ReturnUserProfileDocument = ReturnUserProfile & Document;
export type UserToBeValidateDocument = UserToBeValidate & Document;
export type ReturnUserDocument = ReturnUser & Document;
export const UserSchema = new mongoose.Schema({
    name:{type: String , required: true},
    email: {type: String , required: true},
    password: {type: String , required: true},
    ChatGroups:[{
        chatGroup:{type:Object}
    }],
    Friends:[{
        friend:{type:Object}
    }]
    
},{timestamps:true})
