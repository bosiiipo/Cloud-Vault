"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getAllFolders = exports.getFolder = exports.createFolder = void 0;
const upload_service_1 = require("../services/upload.service");
const config_1 = require("../config");
const errors_1 = require("../responses/errors");
const responses_1 = require("../responses");
const folderService = __importStar(require("../services/folder.service"));
const uploadService = new upload_service_1.UploadService();
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { folderName } = req.body;
        if (!((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            throw new Error('userId is required');
        }
        const userId = req.user.userId;
        const url = yield uploadService.createFolderOnS3(folderName, config_1.config.s3Bucket, userId);
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
exports.createFolder = createFolder;
const getFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const folderId = req.params.folderId;
        if (!((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: 'Unauthorized: userId is required' });
        }
        const userId = req.user.userId;
        if (!folderId) {
            return res.status(400).json({ message: 'FolderId is required' });
        }
        const input = {
            folderId,
            userId,
        };
        const folder = yield folderService.getFolder(input);
        return res.status(200).json(folder);
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            return res.status(error.statusCode).json({ err: error.message });
        }
        else {
            // eslint-disable-next-line no-console
            console.error('An unknown error occurred');
        }
        return res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: 'Failed to fetch folder details!' });
    }
});
exports.getFolder = getFolder;
const getAllFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const folder = yield folderService.getAllFolders(userId);
        return res.status(200).json(folder);
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
exports.getAllFolders = getAllFolders;
