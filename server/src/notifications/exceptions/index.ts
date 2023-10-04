import { HttpStatus } from "@nestjs/common";
import { ChatAppException } from "../../core/exceptions/chatapp.exception";

export class NotificationCouldNotCreatedException extends ChatAppException{
    constructor( data?: string | object ){
        super( 
            'Notification could not be created',
            4010,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'NotificationCouldNotCreatedException'
        );

        this.name = 'NotificationCouldNotCreatedException';
        Object.setPrototypeOf(this, NotificationCouldNotCreatedException.prototype);
    }
}
export class NotificationNotFoundException extends ChatAppException{
    constructor( data?: string | object ){
        super( 
            'Notification not found',
            4020,
            HttpStatus.NOT_FOUND,
            JSON.stringify(data),
            'NotificationNotFoundException'
        );

        this.name = 'NotificationNotFoundException';
        Object.setPrototypeOf(this, NotificationNotFoundException.prototype);
    }
}