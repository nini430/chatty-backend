import {StatusCodes} from 'http-status-codes';

export interface ErrorResponse {
    message: string;
    statusCode: number;
    status: string;
    serializeErrors(): IError;
}


export interface IError {
    message: string;
    statusCode: number;
    status: string;
}


export abstract class CustomError extends Error {
   abstract statusCode: number;
   abstract status: string;
   constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
   }

   serializeErrors(): IError {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status
        };
   }
}


export class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = 'error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class NotFoundError extends CustomError {
    statusCode = StatusCodes.NOT_FOUND;
    status= 'not_found';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class NotAuthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED;
    status='unauthorized';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class FileTooLargeError extends CustomError {
    statusCode = StatusCodes.REQUEST_TOO_LONG;
    status= 'file_too_large';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class ServerError extends CustomError {
    statusCode = StatusCodes.SERVICE_UNAVAILABLE;
    status='server_error';

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export class JoiRequestValidationError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status='validation_error';

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, JoiRequestValidationError.prototype);
    }
}