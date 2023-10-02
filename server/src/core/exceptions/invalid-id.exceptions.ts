import { HttpStatus } from "@nestjs/common";
import { ChatAppException } from "./chatapp.exception";

export class InvalidIdException extends ChatAppException{
    constructor(data?: string ) {
        super(
            'Invalid Id',
            1,
            HttpStatus.BAD_REQUEST,
            data,
            'InvalidIdException'
        );
        this.name = 'InvalidIdException';
        Object.setPrototypeOf(this, InvalidIdException.prototype);
    }
}