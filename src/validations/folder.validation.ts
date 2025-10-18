import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
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

/**
 * 📂 Create Folder
 */
export const validateCreateFolder = [
  body("name").notEmpty().withMessage("Folder name is required"),
  body("parentId")
    .optional()
    .isString()
    .withMessage("Parent ID must be a string"),
  handleValidation,
];

/**
 * ✏️ Update Folder
 */
export const validateUpdateFolder = [
  param("folderId").notEmpty().withMessage("Folder ID is required"),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string"),
  handleValidation,
];

/**
 * 🗑 Delete Folder
 */
export const validateDeleteFolder = [
  param("folderId").notEmpty().withMessage("Folder ID is required"),
  handleValidation,
];
