import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
    statusCode = 404

    constructor(public details: object) {

        super('Route not found!', details)

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }


    serializeErrors() {
        return [{ 'message': 'Not Found', details: this.details }]
    }
}