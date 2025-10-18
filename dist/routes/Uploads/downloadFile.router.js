"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFileRouter = void 0;
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_controller_1 = require("../../controllers/upload.controller");
const config_1 = require("../../config");
dotenv_1.default.config();
const api = config_1.config.api;
const router = (0, express_1.Router)();
exports.downloadFileRouter = router;
const upload = (0, multer_1.default)();
router.post(`${api}/download`, auth_middleware_1.authenticateUser, upload.single('file'), upload_controller_1.generateDownloadUrl);
