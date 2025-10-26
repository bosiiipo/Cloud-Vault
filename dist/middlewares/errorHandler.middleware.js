"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../lib/logger"));
const responses_1 = require("../responses");
const errors_1 = require("../responses/errors");
exports.default = (err, req, res) => {
    if (err instanceof errors_1.AppError) {
        return (0, responses_1.sendFailureResponse)(res, err.statusCode, err.message, err.data);
    }
    logger_1.default.error({
        message: err.message,
        stack: err.stack,
        ts: Date.now(),
    }, 'INTERNAL_ERROR');
    return (0, responses_1.sendFailureResponse)(res, responses_1.StatusCode.SERVER_ERROR, 'Something went wrong. Please try again later');
};
