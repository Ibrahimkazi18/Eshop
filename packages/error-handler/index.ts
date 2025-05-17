export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details ?: any;

    constructor(message : string, statusCode:number, isOperational = true, details?:any) {
        super(message);

        this.statusCode = statusCode,
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace(this);
    }
}

// Not found error
export class NotFound extends AppError {
    constructor(message="Resources Not Found") {
        super(message, 404);
    }
}

// Validation Error ( use for Joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
    constructor(message="Invalid request data", details?:any) {
        super(message, 400, details);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message="Unathorized") {
        super(message, 401);
    }
}

// Forbidden Error (For insufficent parameter)
export class ForbiddenError extends AppError {
    constructor(message="Forbidden Access") {
        super(message, 403);
    }
}

// Database Error (for MongoDb / Postgress error)
export class DatabaseError extends AppError {
    constructor(message="Database Error", details?:any) {
        super(message, 500, true, details);
    }
}

// Rate Limit Error (if user exceeds API limits)
export class RateLimitError extends AppError {
    constructor(message="Too many requests, please try again later.") {
        super(message, 429);
    }
}