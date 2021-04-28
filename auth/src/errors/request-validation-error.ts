import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400
    constructor(public errors: ValidationError[], public details: object) {
        super('Invalid request parameters', details);
        //Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(error => ({ message: error.msg, field: error.param, details: this.details }))
    }

}


