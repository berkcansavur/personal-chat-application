import { HttpStatus } from "@nestjs/common";
import { BaseCustomException } from "./base-custom.exception";

const createChatAppErrorResponse = (exception: ChatAppException) => {
    const error = exception?.constructor?.name;
    const { code, message, data, errorData } = exception;
    return {
        code,
        error,
        message,
        data,
        errorData
    }
}

export class ChatAppException extends BaseCustomException{
    constructor(
        public readonly message: string,
        public readonly code: number,
        public readonly statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        public readonly data?: unknown,
        public readonly errorData?: unknown
    ){
        super(message, code, statusCode, data);

        this.name = 'ChatAppException';
        Object.setPrototypeOf(this, ChatAppException.prototype);
    }
    public createErrorResponse() {
        return createChatAppErrorResponse(this);
    }
}