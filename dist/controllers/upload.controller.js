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
exports.uploadMultipleFiles = exports.generateDownloadUrl = exports.uploadSingleFile = void 0;
const upload_service_1 = require("../services/upload.service");
const config_1 = require("../config");
const uploadService = new upload_service_1.UploadService();
const uploadSingleFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file;
        const folderName = req.query.folderName;
        if (!file) {
            return res.status(400).json({ message: "No file provided" });
        }
        if (!((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            throw new Error("userId is required");
        }
        const userId = req.user.userId;
        const result = yield uploadService.uploadFile(file, "cloud-vault", userId, folderName);
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: "Upload failed", error: error.message });
    }
});
exports.uploadSingleFile = uploadSingleFile;
const generateDownloadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { key } = req.query;
        if (!key || typeof key !== "string") {
            return res.status(400).json({ message: "File key is required" });
        }
        const url = yield uploadService.generateDownloadUrl(key, config_1.config.s3Bucket);
        return res.status(200).json({ url });
    }
    catch (error) {
        console.error("Generate download URL failed:", error);
        return res.status(500).json({ message: "Failed to generate download URL", error: error.message });
    }
});
exports.generateDownloadUrl = generateDownloadUrl;
const uploadMultipleFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files provided" });
        }
        const result = yield uploadService.uploadMultipleFiles(files, "user");
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Upload multiple failed:", error);
        return res.status(500).json({ message: "Upload multiple failed", error: error.message });
    }
});
exports.uploadMultipleFiles = uploadMultipleFiles;
