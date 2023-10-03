import { HttpStatus } from "@nestjs/common";
import { ChatAppException } from "src/core/exceptions/chatapp.exception";

export class MessageCouldNotCreatedException extends ChatAppException{
    constructor( data?: string |object){
        super(
            'Message could not be created',
            3010,
            HttpStatus.BAD_REQUEST,
            JSON.stringify(data),
            'MessageCouldNotCreatedException'
        )
        this.name = 'MessageCouldNotCreatedException';
        Object.setPrototypeOf( this, MessageCouldNotCreatedException.prototype);
    }
}