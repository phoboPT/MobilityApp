import { CustomError } from './custom-error';


export class DatabaseConnectionError extends CustomError {
    reason = 'Database connection failed'
    statusCode = 500
    constructor() {
        super('Database connection failed');
        //Only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors() {


        return [
            {
                message: this.reason
            }
        ]
    }
}


