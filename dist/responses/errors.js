"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsError = exports.ConflictError = exports.AccessDenied = exports.ResourceNotFound = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.InternalError = exports.AppError = void 0;
const _1 = require(".");
class AppError extends Error {
    constructor(message, statusCode, data) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class InternalError extends AppError {
    constructor(message = 'Internal server error', data) {
        super(message, _1.StatusCode.SERVER_ERROR, data);
    }
}
exports.InternalError = InternalError;
class ValidationError extends AppError {
    constructor(message = 'Validation error', data) {
        super(message, _1.StatusCode.BAD_REQUEST, data);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', data) {
        super(message, _1.StatusCode.UNAUTHORIZED, data);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'Access forbidden', data) {
        super(message, _1.StatusCode.FORBIDDEN, data);
    }
}
exports.AuthorizationError = AuthorizationError;
class ResourceNotFound extends AppError {
    constructor(message = 'Resource not found', query) {
        const data = typeof query === 'string' ? { query } : query;
        super(message, _1.StatusCode.NOT_FOUND, data);
    }
}
exports.ResourceNotFound = ResourceNotFound;
class AccessDenied extends AppError {
    constructor(message = 'Access denied', data) {
        super(message, _1.StatusCode.UNAUTHORIZED, data);
    }
}
exports.AccessDenied = AccessDenied;
class ConflictError extends AppError {
    constructor(message = 'Conflict error', data) {
        super(message, _1.StatusCode.CONFLICT, data);
    }
}
exports.ConflictError = ConflictError;
class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests', data) {
        super(message, _1.StatusCode.TOO_MANY_REQUESTS, data);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
