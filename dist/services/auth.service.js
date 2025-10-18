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
exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prisma_1 = __importDefault(require("../lib/prisma"));
const cuid2_1 = require("@paralleldrive/cuid2");
const redis_1 = require("../lib/redis");
const createUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, role, password } = input;
        if (!fullName)
            throw new Error("Full name is required!");
        if (!email)
            throw new Error("Email is required!");
        if (!password)
            throw new Error("Password is required!");
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User with email exists!');
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                fullName,
                role,
                password: hashedPassword
            }
        });
        const sessionId = (0, cuid2_1.createId)();
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role, sessionId }, config_1.config.jwtSecret, {
            expiresIn: '3600s',
        });
        const redisClient = yield (0, redis_1.getRedisConnection)();
        yield redisClient.set(`session:${sessionId}`, JSON.stringify({
            userId: user.id,
            email: user.email,
            role: user.role,
            sessionId,
            createdAt: Date.now()
        }), { EX: 60 * 60 });
        return jwtToken;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        else {
            throw new Error('An unknown error occurred');
        }
    }
});
exports.createUser = createUser;
const loginUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = input;
    const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!existingUser) {
        throw new Error('Account not found!');
    }
    const passwordValidated = yield bcryptjs_1.default.compare(password, existingUser.password);
    if (!passwordValidated)
        throw new Error('Invalid Password');
    const sessionId = (0, cuid2_1.createId)();
    const jwtToken = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.email, role: existingUser.role, sessionId }, config_1.config.jwtSecret, {
        expiresIn: '3600s',
    });
    const redisClient = yield (0, redis_1.getRedisConnection)();
    yield redisClient.set(`session:${sessionId}`, JSON.stringify({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        sessionId,
        createdAt: Date.now()
    }), { EX: 60 * 60 });
    return jwtToken;
});
exports.loginUser = loginUser;
