export abstract class CustomError extends Error {
    abstract statusCode: number

    constructor(message: string, public details: object) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    abstract serializeErrors(): { message: string; field?: string, details?: object }[]
}

