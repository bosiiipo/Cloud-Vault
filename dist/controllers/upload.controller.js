"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.generateDownloadUrl = exports.uploadSingleFile = void 0;
const upload_service_1 = require("../services/upload.service");
const config_1 = require("../config");
const errors_1 = require("../responses/errors");
const responses_1 = require("../responses");
const stream_1 = require("stream");
const uploadService = new upload_service_1.UploadService();
const uploadSingleFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file;
        const folderName = req.query.folderName;
        if (!file) {
            throw new errors_1.ValidationError('No file provided');
        }
        if (!((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            throw new Error('userId is required');
        }
        const userId = req.user.userId;
        const result = yield uploadService.uploadFile(file, config_1.config.s3Bucket, userId, folderName);
        return res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            return res.status(error.statusCode).json({ err: error.message });
        }
        res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: 'An unknown error occurred' });
    }
});
exports.uploadSingleFile = uploadSingleFile;
const generateDownloadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = req.query;
        if (!key || typeof key !== 'string') {
            return res.status(400).json({ message: 'File key is required' });
        }
        const url = yield uploadService.generateDownloadUrl(key, config_1.config.s3Bucket);
        return res.status(200).json({ url });
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            return res.status(error.statusCode).json({ err: error.message });
        }
        else {
            // eslint-disable-next-line no-console
            console.error('An unknown error occurred');
        }
        return res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: 'Failed to generate download URL' });
    }
});
exports.generateDownloadUrl = generateDownloadUrl;
function isWebReadableStream(body) {
    return (typeof body === 'object' &&
        body !== null &&
        typeof body.getReader === 'function');
}
const downloadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = req.query;
        if (!key || typeof key !== 'string') {
            return res.status(400).json({ message: 'File key is required' });
        }
        const file = yield uploadService.downloadFile(key);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key.split('/').pop() || key)}"`);
        res.setHeader('Content-Type', file.ContentType || 'application/octet-stream');
        let bodyStream;
        if (file.Body instanceof stream_1.Readable) {
            // Native Node.js stream
            bodyStream = file.Body;
        }
        else if (isWebReadableStream(file.Body)) {
            // Convert Web ReadableStream → Node Readable
            bodyStream = stream_1.Readable.fromWeb(file.Body);
        }
        else {
            throw new Error('Unsupported stream type from S3 response');
        }
        bodyStream.pipe(res);
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            return res.status(error.statusCode).json({ err: error.message });
        }
        else {
            console.error('File download failed:', error);
        }
        return res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: 'Failed to download file' });
    }
});
exports.downloadFile = downloadFile;
