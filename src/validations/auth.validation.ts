import {body, validationResult} from 'express-validator';
import {Request, Response, NextFunction} from 'express';

export const validateRegister = [
  body('fullName').isString().withMessage('Please provide full name'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('role')
    .optional()
    .trim()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Invalid role. Allowed values: USER, ADMIN')
    .toUpperCase(),
  body('password')
    .isLength({min: 12})
    .withMessage('Password must be at least 12 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .optional()
    .isLength({min: 12})
    .withMessage('Password must be at least 12 characters long'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

