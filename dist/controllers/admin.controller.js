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
exports.unFlagFile = exports.flagFileAsUnsafe = exports.flagFile = exports.getPendingFiles = void 0;
const adminService = __importStar(require("../services/admin.service"));
const getPendingFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield adminService.getPendingUploads();
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ err: err.message });
        }
        else {
            res.status(400).json({ err: 'An unknown error occurred' });
        }
    }
});
exports.getPendingFiles = getPendingFiles;
const flagFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fileId } = req.params;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!adminId) {
            return res.status(401).json({ error: "Unauthorized: Admin ID is required" });
        }
        const input = {
            fileId,
            adminId,
            reason: req.body.reason
        };
        const data = yield adminService.flagFile(input);
        const sanitizedFile = Object.assign(Object.assign({}, data.file), { size: Number(data.file.size) });
        res.status(200).json(Object.assign(Object.assign({}, data), { file: sanitizedFile }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ err: err.message });
        }
        else {
            res.status(400).json({ err: 'An unknown error occurred' });
        }
    }
});
exports.flagFile = flagFile;
const flagFileAsUnsafe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fileId } = req.params;
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ error: 'Reason is required' });
        }
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!adminId) {
            return res.status(401).json({ error: "Unauthorized: Admin ID is required" });
        }
        const input = {
            reason,
            fileId,
            adminId
        };
        const data = yield adminService.flagFileAsUnsafe(input);
        const sanitizedFile = Object.assign(Object.assign({}, data.file), { size: Number(data.file.size) });
        res.status(200).json(Object.assign(Object.assign({}, data), { file: sanitizedFile }));
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ err: err.message });
        }
        else {
            res.status(400).json({ err: 'An unknown error occurred' });
        }
    }
});
exports.flagFileAsUnsafe = flagFileAsUnsafe;
const unFlagFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fileId } = req.params;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!adminId) {
            return res.status(401).json({ error: "Unauthorized: Admin ID is required" });
        }
        const input = {
            fileId,
            adminId,
            reason: req.body.reason
        };
        const data = yield adminService.unflagFile(input);
        const sanitizedFile = Object.assign(Object.assign({}, data.file), { size: Number(data.file.size) });
        res.status(200).json(sanitizedFile);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ err: err.message });
        }
        else {
            res.status(400).json({ err: 'An unknown error occurred' });
        }
    }
});
exports.unFlagFile = unFlagFile;
