import { User } from './users.model';
import mongoose, { Model } from 'mongoose';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    createUser(name: string, email: string, password: string): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    findUserById(id: string): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    findUser(id: mongoose.Types.ObjectId): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    findOne(email: string): Promise<(mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>)[]>;
    findByEmail(email: string): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    addChatGroupToUser(userId: string, chatGroup: object): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    removeChatGroupFromUser(user: any, chatGroup: any): Promise<void>;
    addFriend(userId: string, friend: object): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    removeFriend(userId: string, friendId: string): Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>>;
    getFriendsOfUser(userId: mongoose.Types.ObjectId): Promise<object[]>;
    getUserData(userObject: Object): Promise<{
        _id: string;
        name: string;
        email: string;
        ChatGroups: object[];
    }>;
    searchUser(searchText: string): Promise<(mongoose.Document<unknown, {}, User> & User & Required<{
        _id: string;
    }>)[]>;
}
