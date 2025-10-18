"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDenied = exports.ResourceNotFound = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.InternalError = exports.AppError = void 0;
const _1 = require(".");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class InternalError extends AppError {
    constructor(message, data) {
        super(message, _1.StatusCode.SERVER_ERROR);
        this.data = data;
    }
}
exports.InternalError = InternalError;
class ValidationError extends AppError {
    constructor(message, data) {
        super(message, _1.StatusCode.BAD_REQUEST);
        this.data = data;
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message, data) {
        super(message, _1.StatusCode.UNAUTHORIZED);
        this.data = data;
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message, data) {
        super(message, _1.StatusCode.FORBIDDEN);
        this.data = data;
    }
}
exports.AuthorizationError = AuthorizationError;
class ResourceNotFound extends AppError {
    constructor(message, query) {
        super(message, _1.StatusCode.NOT_FOUND);
        this.data = { query };
    }
}
exports.ResourceNotFound = ResourceNotFound;
class AccessDenied extends AppError {
    constructor(message, data) {
        super(message, _1.StatusCode.UNAUTHORIZED);
        this.data = data;
    }
}
exports.AccessDenied = AccessDenied;
