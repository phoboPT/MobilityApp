import { CustomError } from './custom-error';


export class DatabaseConnectionError extends CustomError {
    reason = 'Database connection failed'
    statusCode = 500

    constructor(public details: object) {
        super("hello", details);
        //Only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {


        return [
            {
                message: this.reason,
                details: this.details
            }
        ]
    }
}


