"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)('fullName').isString().withMessage('Please provide full name'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('role')
        .optional()
        .trim()
        .isIn(['USER', 'ADMIN'])
        .withMessage('Invalid role. Allowed values: USER, ADMIN')
        .toUpperCase(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 12 })
        .withMessage('Password must be at least 12 characters long'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 12 })
        .withMessage('Password must be at least 12 characters long'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
