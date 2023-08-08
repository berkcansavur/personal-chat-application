import * as mongoose from "mongoose";
export declare const ChatGroupsSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    chatGroupName: string;
    users: {
        user?: any;
    }[];
    createdDate?: Date;
}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    chatGroupName: string;
    users: {
        user?: any;
    }[];
    createdDate?: Date;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    chatGroupName: string;
    users: {
        user?: any;
    }[];
    createdDate?: Date;
} & {
    _id: mongoose.Types.ObjectId;
}>;
export interface ChatGroups {
    id: number;
    chatGroupName: string;
    users: object[];
    createdDate: Date;
}
