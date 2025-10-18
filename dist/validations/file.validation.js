"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStreamFile = exports.validateFileDelete = exports.validateFileDownload = exports.validateFileUpload = exports.validateFileSize = void 0;
const express_validator_1 = require("express-validator");
const handleValidation = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            errors: errors.array().map((err) => ({
                field: err.type === "field" ? err.path : "unknown",
                message: err.msg,
            })),
        });
    }
    next();
};
// 200MB in bytes
const MAX_FILE_SIZE = 200 * 1024 * 1024;
exports.validateFileSize = [
    // Custom validator to check file existence & size
    (0, express_validator_1.check)("file").custom((_, { req }) => {
        const file = req.file;
        if (!file) {
            throw new Error("File is required.");
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds 200MB limit.`);
        }
        return true;
    }),
    // Return errors in a structured way
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "error",
                errors: errors.array().map(err => ({
                    field: err.type === "field" ? err.path : "file",
                    message: err.msg,
                })),
            });
        }
        next();
    },
];
/**
 * 📁 Upload File
 * - max 200MB check can be enforced at middleware / file upload handler
 */
exports.validateFileUpload = [
    (0, express_validator_1.body)("folderId")
        .optional()
        .isString()
        .withMessage("Folder ID must be a string"),
    (0, express_validator_1.body)("fileName")
        .notEmpty()
        .isString()
        .withMessage("File name is required"),
    handleValidation,
];
/**
 * 📥 Download File
 */
exports.validateFileDownload = [
    (0, express_validator_1.param)("fileId")
        .notEmpty()
        .isString()
        .withMessage("File ID is required"),
    handleValidation,
];
/**
 * 🧾 Delete File
 */
exports.validateFileDelete = [
    (0, express_validator_1.param)("fileId")
        .notEmpty()
        .isString()
        .withMessage("File ID is required"),
    handleValidation,
];
/**
 * 📽 Stream File (video/audio)
 */
exports.validateStreamFile = [
    (0, express_validator_1.param)("fileId")
        .notEmpty()
        .isString()
        .withMessage("File ID is required"),
    handleValidation,
];
