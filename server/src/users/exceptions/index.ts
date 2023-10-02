import { HttpStatus } from "@nestjs/common";
import { ChatAppException } from "src/core/exceptions/chatapp.exception";

export class UserNotFoundException extends ChatAppException{
    constructor( data?: string | object ) {
        super(
            'User not found',
            1010,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'UserNotFoundException'
        );
        
        this.name = 'UserNotFoundException';
        Object.setPrototypeOf(this, UserNotFoundException.prototype);

    }
}
export class UsersNotFoundException extends ChatAppException{
    constructor( data?: string | object ) {
        super(
            'Users not found',
            1011,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'UsersNotFoundException'
        );
        
        this.name = 'UsersNotFoundException';
        Object.setPrototypeOf(this, UsersNotFoundException.prototype);

    }
}
export class UserCouldNotCreatedException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'User could not be created',
            1012,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'UserCouldNotCreateException'
        );

        this.name = 'UserCouldNotCreateException';
        Object.setPrototypeOf(this, UserCouldNotCreatedException.prototype);
    }
}
export class UserAccessTokenCouldNotAssigned extends ChatAppException{
    constructor( data?: string | object ) {
        super(
            'Users access token could not be assigned',
            1020,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'UserAccessTokenCouldNotAssigned'
        );
        
        this.name = 'UserAccessTokenCouldNotAssigned';
        Object.setPrototypeOf(this, UserAccessTokenCouldNotAssigned.prototype);

    }
}
export class UserAccessTokenCouldNotRetrieved extends ChatAppException{
    constructor( data?: string | object ) {
        super(
            'User access token could not retrieved',
            1021,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'UserAccessTokenCouldNotRetrieved'
        );
        
        this.name = 'UserAccessTokenCouldNotRetrieved';
        Object.setPrototypeOf(this, UserAccessTokenCouldNotRetrieved.prototype);

    }
}
export class UserAccessTokenCouldNotRemoved extends ChatAppException{
    constructor( data?: string | object ) {
        super(
            'User access token could not removed',
            1022,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'UserAccessTokenCouldNotRemoved'
        );
        
        this.name = 'UserAccessTokenCouldNotRemoved';
        Object.setPrototypeOf(this, UserAccessTokenCouldNotRemoved.prototype);

    }
}
export class EmailIsNotExistException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'Email is not exists',
            1030,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'EmailIsNotExistException'
        );

        this.name = 'EmailIsNotExistException';
        Object.setPrototypeOf(this, EmailIsNotExistException.prototype);
    }
}
export class PasswordIsNotValidException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'Password is not valid',
            1040,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'PasswordIsNotValidException'
        );

        this.name = 'PasswordIsNotValidException';
        Object.setPrototypeOf(this, PasswordIsNotValidException.prototype);
    }
}
export class EmailIsAlreadyExistException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'Email is already in use',
            1050,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'EmailIsAlreadyExistException'
        );

        this.name = 'EmailIsAlreadyExistException';
        Object.setPrototypeOf(this, EmailIsAlreadyExistException.prototype);
    }
}
export class UserCouldNotAddedToChatGroupException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'User could not added to chat group',
            1060,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'UserCouldNotAddedToChatGroupException'
        );

        this.name = 'UserCouldNotAddedToChatGroupException';
        Object.setPrototypeOf(this, UserCouldNotAddedToChatGroupException.prototype);
    }
}
export class UserCouldNotRemovedFromChatGroupException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'User could not removed from chat group',
            1061,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'UserCouldNotRemovedFromChatGroupException'
        );

        this.name = 'UserCouldNotRemovedFromChatGroupException';
        Object.setPrototypeOf(this, UserCouldNotRemovedFromChatGroupException.prototype);
    }
}
export class FriendCouldNotAddedException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'Friend could not added',
            1070,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'FriendCouldNotAddedException'
        );

        this.name = 'FriendCouldNotAddedException';
        Object.setPrototypeOf(this, FriendCouldNotAddedException.prototype);
    }
}
export class FriendCouldNotRemovedException extends ChatAppException {
    constructor( data?: string | object ) {
        super(
            'Friend could not removed',
            1071,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'FriendCouldNotRemovedException'
        );

        this.name = 'FriendCouldNotRemovedException';
        Object.setPrototypeOf(this, FriendCouldNotRemovedException.prototype);
    }
}
