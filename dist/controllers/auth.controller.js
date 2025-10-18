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
exports.logout = exports.loginUser = exports.registerUser = void 0;
const authService = __importStar(require("../services/auth.service"));
const redis_1 = require("../lib/redis");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield authService.createUser(req.body);
        res.status(201).json({ message: 'User registered successfully', data });
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
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield authService.loginUser(req.body);
        res.status(200).json({ message: 'User signed in successfully', data });
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
exports.loginUser = loginUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.sessionId) {
        const redisClient = yield (0, redis_1.getRedisConnection)();
        yield redisClient.del(`session:${req.user.sessionId}`);
    }
    res.status(200).json({ message: "Logged out successfully" });
});
exports.logout = logout;
