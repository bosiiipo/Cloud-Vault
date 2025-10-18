"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToFolderRouter = void 0;
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_controller_1 = require("../../controllers/upload.controller");
const config_1 = require("../../config");
const file_validation_1 = require("../../validations/file.validation");
dotenv_1.default.config();
const api = config_1.config.api;
const router = (0, express_1.Router)();
exports.uploadFileToFolderRouter = router;
const upload = (0, multer_1.default)();
router.post(`${api}/upload/:folderName`, auth_middleware_1.authenticateUser, upload.single("file"), file_validation_1.validateFileSize, file_validation_1.validateFileUpload, upload_controller_1.uploadSingleFile);
