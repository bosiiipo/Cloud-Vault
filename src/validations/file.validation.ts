import {body, param, validationResult, check} from 'express-validator';
import {Request, Response, NextFunction} from 'express';

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
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

// 200MB in bytes
const MAX_FILE_SIZE = 200 * 1024 * 1024;

export const validateFileSize = [
  // Custom validator to check file existence & size
  check('file').custom((_, {req}) => {
    const file = (req as Request).file;

    if (!file) {
      throw new Error('File is required.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds 200MB limit.`);
    }

    return true;
  }),

  // Return errors in a structured way
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array().map(err => ({
          field: err.type === 'field' ? err.path : 'file',
          message: err.msg,
        })),
      });
    }
    next();
  },
];

export const validateFileUpload = [
  body('folderId').optional().isString().withMessage('Folder ID must be a string'),

  body('fileName').notEmpty().isString().withMessage('File name is required'),

  handleValidation,
];

export const validateFileDownload = [
  param('fileId').notEmpty().isString().withMessage('File ID is required'),
  handleValidation,
];

export const validateFileDelete = [
  param('fileId').notEmpty().isString().withMessage('File ID is required'),
  handleValidation,
];

export const validateStreamFile = [
  param('fileId').notEmpty().isString().withMessage('File ID is required'),
  handleValidation,
];
