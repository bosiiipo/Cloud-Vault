import {Response} from 'express';

/* eslint-disable no-unused-vars */
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export const sendSuccessResponse = (
  response: Response,
  status: StatusCode,
  message?: string,
  data?: unknown,
) => {
  return response.status(status).json({
    status: 'success',
    message: message || 'Success',
    data,
  });
};

export const sendFailureResponse = (
  response: Response,
  status: StatusCode,
  message?: string,
  errors?: object,
) =>
  response.status(status).json({
    status: 'error',
    message: message || 'Something went wrong',
    errors,
  });
