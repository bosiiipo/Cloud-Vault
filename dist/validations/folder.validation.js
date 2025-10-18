"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeleteFolder = exports.validateUpdateFolder = exports.validateCreateFolder = void 0;
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
 * 📂 Create Folder
 */
exports.validateCreateFolder = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Folder name is required'),
    (0, express_validator_1.body)('parentId').optional().isString().withMessage('Parent ID must be a string'),
    handleValidation,
];
/**
 * ✏️ Update Folder
 */
exports.validateUpdateFolder = [
    (0, express_validator_1.param)('folderId').notEmpty().withMessage('Folder ID is required'),
    (0, express_validator_1.body)('name').optional().isString().withMessage('Name must be a string'),
    handleValidation,
];
/**
 * 🗑 Delete Folder
 */
exports.validateDeleteFolder = [
    (0, express_validator_1.param)('folderId').notEmpty().withMessage('Folder ID is required'),
    handleValidation,
];
