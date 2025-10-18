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
const errors_1 = require("../responses/errors");
const responses_1 = require("../responses");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield authService.createUser(req.body);
        res.status(201).json({
            message: 'User registered successfully',
            token,
        });
    }
    catch (err) {
        if (err instanceof errors_1.AppError) {
            return res.status(err.statusCode).json({ err: err.message });
        }
        res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: 'An unknown error occurred' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield authService.loginUser(req.body);
        res.status(200).json({
            message: 'User signed in successfully',
            token,
        });
    }
    catch (err) {
        if (err instanceof errors_1.AppError) {
            return res.status(err.statusCode).json({ err: err.message });
        }
        res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: 'An unknown error occurred' });
    }
});
exports.loginUser = loginUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !req.user.sessionId) {
            return res.status(responses_1.StatusCode.OK).json({ message: 'No active session' });
        }
        const redisClient = yield (0, redis_1.getRedisConnection)();
        const sessionKey = `session:${req.user.sessionId}`;
        const existingSession = yield redisClient.get(sessionKey);
        if (!existingSession) {
            return res.status(responses_1.StatusCode.OK).json({ message: 'Session already ended' });
        }
        yield redisClient.del(sessionKey);
        return res.status(responses_1.StatusCode.OK).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        let message = 'An error occurred while logging out';
        if (error instanceof Error) {
            // eslint-disable-next-line no-console
            console.error('Logout error:', error.message);
            message = error.message;
        }
        return res.status(responses_1.StatusCode.SERVER_ERROR).json({ err: message });
    }
});
exports.logout = logout;
