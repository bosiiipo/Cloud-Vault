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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const globals_1 = require("@jest/globals");
const faker_1 = require("@faker-js/faker");
(0, globals_1.describe)('POST /api/v1/auth/signUp', () => {
    (0, globals_1.test)('Should respond with a 201 status code', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeUser = {
            fullName: `${faker_1.faker.person.firstName()} ${faker_1.faker.person.lastName()}`,
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(),
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/api/v1/auth/signUp')
            .send(fakeUser);
        (0, globals_1.expect)(response.statusCode).toBe(201);
        (0, globals_1.expect)(response.body).toEqual({
            status: 'success',
            message: 'User created successfully',
            data: {
                user: globals_1.expect.objectContaining({
                    _id: globals_1.expect.any(String),
                    fullName: globals_1.expect.any(String),
                    email: globals_1.expect.any(String),
                }),
                jwtToken: globals_1.expect.any(String),
            },
        });
    }));
    (0, globals_1.test)('Should successfully login a newly created user', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeUser = {
            fullName: `${faker_1.faker.person.firstName()} ${faker_1.faker.person.lastName()}`,
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(),
        };
        const response = yield (0, supertest_1.default)(server_1.default)
            .post('/api/v1/auth/signUp')
            .send(fakeUser);
        const fakeLogin = {
            email: response.body.data.user.email,
            password: fakeUser.password,
        };
        const authResponse = yield (0, supertest_1.default)(server_1.default).post('/api/v1/auth/signIn').send(fakeLogin);
        (0, globals_1.expect)(authResponse.statusCode).toBe(200);
        (0, globals_1.expect)(authResponse.body).toEqual({
            status: 'success',
            message: 'User signed in successfully',
            data: globals_1.expect.any(String),
        });
    }));
});
