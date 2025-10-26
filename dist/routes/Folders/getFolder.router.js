"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFolderRouter = void 0;
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const folder_controller_1 = require("../../controllers/folder.controller");
const config_1 = require("../../config");
dotenv_1.default.config();
const api = config_1.config.api;
const router = (0, express_1.Router)();
exports.getFolderRouter = router;
router.get(`${api}/folder/:folderId`, auth_middleware_1.authenticateUser, folder_controller_1.getFolder);
