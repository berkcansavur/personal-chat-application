import * as mongoose from 'mongoose';
export interface User {
    _id:string; 
    name: string;
    email: string;
    password: string;
    Friends: object[];
    ChatGroups: object[];
}
export class UserEntity{
    id:string;
    name:string;
    email:string;
    password:string;
    Friends: object[];
    ChatGroups:string;
}
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
