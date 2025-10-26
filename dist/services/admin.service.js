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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unflagFile = exports.flagFileAsUnsafe = exports.flagFile = exports.getPendingUploads = void 0;
const config_1 = require("../config");
const prisma_1 = __importDefault(require("../lib/prisma"));
const upload_service_1 = require("./upload.service");
const getPendingUploads = () => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield prisma_1.default.file.findMany({
        where: {
            OR: [{ isFlagged: true }, { status: 'FLAGGED' }],
        },
        include: {
            user: {
                select: { id: true, email: true, fullName: true },
            },
            reviews: {
                include: {
                    admin: { select: { email: true, fullName: true } },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
        // orderBy: { flaggedAt: 'desc' }
    });
    return files;
});
exports.getPendingUploads = getPendingUploads;
const flagFile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, reason, adminId } = input;
    const file = yield prisma_1.default.file.findUnique({
        where: { id: fileId },
        include: { user: true },
    });
    if (!file) {
        // const err: any = new Error('File not found!');
        // err.statusCode = 404;
        // throw err;
        throw new Error('File not found!');
    }
    if (file.isDeleted) {
        throw new Error('File has been deleted!');
    }
    if (file.isFlagged) {
        throw new Error('File has been flagged already!');
    }
    const review = yield prisma_1.default.fileReview.create({
        data: {
            fileId,
            adminId,
            verdict: 'PENDING',
            reason,
        },
    });
    // Update file status
    const updatedFile = yield prisma_1.default.file.update({
        where: { id: fileId },
        data: {
            status: 'FLAGGED',
            isFlagged: true,
            flaggedBy: adminId,
        },
    });
    return {
        success: true,
        file: updatedFile,
        review,
        message: 'File flagged successfully!',
    };
});
exports.flagFile = flagFile;
const flagFileAsUnsafe = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, reason, adminId } = input;
    const file = yield prisma_1.default.file.findUnique({
        where: { id: fileId },
        include: { user: true },
    });
    if (!file) {
        throw new Error('File not found!');
    }
    if (file.isDeleted) {
        throw new Error('File has been deleted!');
    }
    const review = yield prisma_1.default.fileReview.create({
        data: {
            fileId,
            adminId,
            verdict: 'REJECTED',
            reason,
        },
    });
    const updatedFile = yield prisma_1.default.file.update({
        where: { id: fileId },
        data: {
            status: 'UNSAFE',
            isFlagged: true,
            flaggedBy: adminId,
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: adminId,
        },
    });
    const uploadService = new upload_service_1.UploadService();
    yield uploadService.deleteFromS3(file.s3Key, config_1.config.s3Bucket);
    return {
        success: true,
        file: updatedFile,
        review,
        message: 'File deleted successfully!',
    };
});
exports.flagFileAsUnsafe = flagFileAsUnsafe;
const unflagFile = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileId, reason, adminId } = input;
    const file = yield prisma_1.default.file.findUnique({
        where: { id: fileId },
        include: { user: true },
    });
    if (!file) {
        throw new Error('File not found!');
    }
    if (file.isDeleted) {
        throw new Error('File has been deleted!');
    }
    const review = yield prisma_1.default.fileReview.create({
        data: {
            fileId,
            adminId,
            verdict: 'APPROVED',
            reason,
        },
    });
    // Update file status
    const updatedFile = yield prisma_1.default.file.update({
        where: { id: fileId },
        data: {
            status: 'ACTIVE',
            isFlagged: false,
            flaggedBy: adminId,
        },
    });
    return {
        success: true,
        file: updatedFile,
        review,
    };
});
exports.unflagFile = unflagFile;
