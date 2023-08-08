import * as mongoose from 'mongoose';
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    Friends: object[];
    ChatGroups: object[];
}
export declare class UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    Friends: object[];
    ChatGroups: string;
}
export declare const UserSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    ChatGroups: {
        chatGroup?: any;
    }[];
    Friends: {
        friend?: any;
    }[];
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    ChatGroups: {
        chatGroup?: any;
    }[];
    Friends: {
        friend?: any;
    }[];
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    name: string;
    email: string;
    password: string;
    ChatGroups: {
        chatGroup?: any;
    }[];
    Friends: {
        friend?: any;
    }[];
} & {
    _id: mongoose.Types.ObjectId;
}>;
