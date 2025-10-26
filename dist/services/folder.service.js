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
exports.getAllFolders = exports.getFolder = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const errors_1 = require("../responses/errors");
const getFolder = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderId, userId } = input;
    const folder = yield prisma_1.default.folder.findFirst({
        where: {
            id: folderId,
            userId,
        },
        include: {
            files: true,
            children: true,
        },
    });
    if (!folder) {
        throw new errors_1.ResourceNotFound('Folder not found');
    }
    return folder;
});
exports.getFolder = getFolder;
const getAllFolders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = userId ? { userId } : {};
    const folders = yield prisma_1.default.folder.findMany({
        where: whereClause,
        include: {
            files: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return folders;
});
exports.getAllFolders = getAllFolders;
