import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UsersRepository { 
    constructor(@InjectModel('Users') private userModel: Model<User>){}
    
    async createUser( name:string, email:string, password:string ){
        const newUser = new this.userModel({ name, email, password });
        return await newUser.save();
    }
    async findUserById( id: string ) {
        try {
            const user = await this.userModel.findOne({ _id: id });
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findUser( id: mongoose.Types.ObjectId){
        try {
            const user = await this.userModel.find({ _id: id });
            return user;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findOne(email: string){
        return this.userModel.find(user => user.email === email);
    }
    async findByEmail(email: string){
        try {
            return this.userModel.findOne({email: email});
        } catch (error) {
            throw new Error(error);
        }
    }

}