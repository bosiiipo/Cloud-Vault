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
exports.requireAdmin = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const redis_1 = require("../lib/redis");
const client_1 = require("@prisma/client");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided',
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided',
            });
        }
        if (!config_1.config.jwtSecret) {
            throw new Error('JWT secret is not configured');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
            if (!decoded.userId) {
                throw new jsonwebtoken_1.default.JsonWebTokenError('Invalid token payload');
            }
            const sessionKey = `session:${decoded.sessionId}`;
            const redisClient = yield (0, redis_1.getRedisConnection)();
            const exists = yield redisClient.get(sessionKey);
            if (!exists)
                return res.status(401).json({ error: "Session revoked" });
            console.log({ decoded });
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid token',
                });
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Token expired',
                });
            }
            throw error;
        }
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error during authentication',
        });
    }
});
exports.authenticateUser = authenticateUser;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.user.role !== client_1.RoleType.ADMIN) {
        return res.status(403).json({
            error: 'Forbidden - Admin access required',
            role: req.user.role
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
