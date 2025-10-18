"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFailureResponse = exports.sendSuccessResponse = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    StatusCode[StatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
const sendSuccessResponse = (response, status, message, data) => {
    return response.status(status).json({
        status: 'success',
        message: message || 'Success',
        data,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendFailureResponse = (response, status, message, errors) => response.status(status).json({
    status: 'error',
    message: message || 'Something went wrong',
    errors,
});
exports.sendFailureResponse = sendFailureResponse;
