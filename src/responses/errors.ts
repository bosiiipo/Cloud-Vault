import {StatusCode} from '.';

export class AppError extends Error {
  statusCode: StatusCode;
  data?: Record<string, unknown>;

  constructor(message: string, statusCode: StatusCode, data?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error', data?: Record<string, unknown>) {
    super(message, StatusCode.SERVER_ERROR, data);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error', data?: Record<string, unknown>) {
    super(message, StatusCode.BAD_REQUEST, data);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', data?: Record<string, unknown>) {
    super(message, StatusCode.UNAUTHORIZED, data);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden', data?: Record<string, unknown>) {
    super(message, StatusCode.FORBIDDEN, data);
  }
}

export class ResourceNotFound extends AppError {
  constructor(message = 'Resource not found', query?: Record<string, unknown> | string) {
    const data = typeof query === 'string' ? {query} : query;
    super(message, StatusCode.NOT_FOUND, data);
  }
}

export class AccessDenied extends AppError {
  constructor(message = 'Access denied', data?: Record<string, unknown>) {
    super(message, StatusCode.UNAUTHORIZED, data);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict error', data?: Record<string, unknown>) {
    super(message, StatusCode.CONFLICT, data);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests', data?: Record<string, unknown>) {
    super(message, StatusCode.TOO_MANY_REQUESTS, data);
  }
}
