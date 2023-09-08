import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Schema as mSchema, Document, Types } from 'mongoose';
export interface User {
    _id:string; 
    name: string;
    email: string;
    password: string;
    Friends: object[];
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

    @Prop({type: [ Object]})
    ChatGroups:any[];

    @Prop({type: [ Object]})
    Friends:any[];
}
export type ReturnUserDocument = ReturnUser & Document;

export class ReturnUserForAuth{
    @Prop({type: String, required: true})
    email:string;

    @Prop({type: String, required: true})
    password:string;
   
}
export type ReturnUserForAuthDocument = ReturnUserForAuth & Document

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
