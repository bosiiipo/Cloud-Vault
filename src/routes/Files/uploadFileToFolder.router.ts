import {Router} from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import { authenticateUser } from '../../middlewares/auth.middleware';
import { uploadSingleFile } from '../../controllers/upload.controller';
import { config } from '../../config';
import { validateFileSize, validateFileUpload } from '../../validations/file.validation';

dotenv.config();

const api = config.api;

const router = Router();

const upload = multer(); 


router.post(
    `${api}/upload/:folderName`,
    authenticateUser,
    upload.single("file"),
    validateFileSize,
    validateFileUpload,
    uploadSingleFile
);

export {router as uploadFileToFolderRouter};