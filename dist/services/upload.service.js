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
exports.UploadService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const date_fns_1 = require("date-fns");
const path_1 = require("path");
const cuid2_1 = require("@paralleldrive/cuid2");
const config_1 = require("../config");
const prisma_1 = __importDefault(require("../lib/prisma"));
class UploadService {
    constructor() {
        this.env = config_1.config.nodeEnv || 'development';
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: config_1.config.r2Endpoint,
            credentials: {
                accessKeyId: config_1.config.r2AccessKeyId,
                secretAccessKey: config_1.config.r2SecretAccessKey,
            },
        });
    }
    uploadFile(file, bucketType, userId, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const ext = (0, path_1.extname)(file.originalname);
            const timestamp = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd_HH-mm-ss');
            const key = folderName
                ? `${folderName}/${(0, cuid2_1.createId)()}-${timestamp}${ext}`
                : `${(0, cuid2_1.createId)()}-${timestamp}${ext}`;
            const bucketName = this.resolveBucket(bucketType);
            const command = new client_s3_1.PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            yield this.s3.send(command);
            let folderId = null;
            if (folderName) {
                const folder = yield prisma_1.default.folder.findFirst({
                    where: {
                        name: folderName,
                        userId,
                    },
                });
                if (folder) {
                    folderId = folder.id;
                }
                else {
                    const newFolder = yield prisma_1.default.folder.create({
                        data: {
                            name: folderName,
                            userId,
                        },
                    });
                    folderId = newFolder.id;
                }
            }
            yield prisma_1.default.file.create({
                data: {
                    userId,
                    s3Key: key,
                    fileName: file.originalname,
                    size: BigInt(file.size),
                    contentType: file.mimetype,
                    folderId,
                },
            });
            return {
                message: 'File uploaded successfully!',
                key,
            };
        });
    }
    generateDownloadUrl(fileKey, bucketType) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucketName = this.resolveBucket(bucketType);
            const command = new client_s3_1.GetObjectCommand({
                Bucket: bucketName,
                Key: fileKey,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: 60 * 60 });
            return { url };
        });
    }
    deleteFromS3(fileKey, bucketType) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: bucketType,
                Key: fileKey,
            });
            yield this.s3.send(command);
            return 'File deleted successfully!';
        });
    }
    resolveBucket(bucketType) {
        const bucketNames = {
            test: config_1.config.s3Bucket,
        };
        if (['development', 'test', 'local'].includes(this.env)) {
            return bucketNames.test;
        }
        const bucket = bucketNames[bucketType];
        if (!bucket)
            throw new Error(`Invalid bucket type: ${bucketType}`);
        return bucket;
    }
}
exports.UploadService = UploadService;
