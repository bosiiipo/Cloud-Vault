"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdminDeleteFile = exports.validateMarkFileUnsafe = void 0;
const express_validator_1 = require("express-validator");
const handleValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            errors: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg,
            })),
        });
    }
    next();
};
/**
 * 🚫 Mark file as unsafe
 */
exports.validateMarkFileUnsafe = [
    (0, express_validator_1.param)('fileId').notEmpty().withMessage('File ID is required'),
    (0, express_validator_1.body)('reason').optional().isString().withMessage('Reason must be a string'),
    handleValidation,
];
/**
 * 🧹 Delete unsafe file (optional for admin flow)
 */
exports.validateAdminDeleteFile = [
    (0, express_validator_1.param)('fileId').notEmpty().withMessage('File ID is required'),
    handleValidation,
];
