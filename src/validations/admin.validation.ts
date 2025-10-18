import {body, param, validationResult} from 'express-validator';
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

/**
 * 🚫 Mark file as unsafe
 */
export const validateMarkFileUnsafe = [
  param('fileId').notEmpty().withMessage('File ID is required'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  handleValidation,
];

/**
 * 🧹 Delete unsafe file (optional for admin flow)
 */
export const validateAdminDeleteFile = [
  param('fileId').notEmpty().withMessage('File ID is required'),
  handleValidation,
];
