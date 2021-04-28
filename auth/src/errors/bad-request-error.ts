import { CustomError } from './custom-error'

export class BadRequestError extends CustomError {
    statusCode = 400
    constructor(public message: string, public details: object) {
        super(message, details)

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serializeErrors() {
        return [{ message: this.message, details: this.details }]
    }

}