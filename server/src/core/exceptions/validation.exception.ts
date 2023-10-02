import { ERROR_MESSAGES } from "src/common/constants";
import { BaseCustomException } from "./base-custom.exception";
import { HttpStatus } from "@nestjs/common";
import { ValidationErrorMessageType } from "src/common/types";

interface ValidationResponse {
    constraints: Record<string, string>;
    property: string;
}

const creteValidationErrorForResponse = (exception: ValidationException) => {
    const { code, error } = ERROR_MESSAGES.VALIDATION;

    const { constraints, property } = exception.data as ValidationResponse;

    const rawConstraints = Object.values(constraints).filter(Boolean);
    
    const message = rawConstraints.join(', ');

    const details = {
        messages: rawConstraints,
        path: property
    };
    
    return {
        code,
        error,
        message,
        details
    };

}
export class ValidationException extends BaseCustomException {
    constructor( public readonly error : ValidationErrorMessageType ) {
        super(
            ERROR_MESSAGES.VALIDATION.message,
            ERROR_MESSAGES.VALIDATION.code,
            HttpStatus.BAD_REQUEST,
            {
                constraints:error.constraints,
                property: error.property
            }
            );
            this.name = 'ValidationException';
            Object.setPrototypeOf(this, ValidationException.prototype);
    } 
    public createErrorResponse() {
        return creteValidationErrorForResponse(this);    
    }
}