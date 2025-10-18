import {Router} from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import { authenticateUser } from '../../middlewares/auth.middleware';
import { uploadMultipleFiles } from '../../controllers/upload.controller';
import { config } from '../../config';

dotenv.config();

const api = config.api;

const router = Router();

const upload = multer(); 

router.post(`${api}/upload/multiple`, authenticateUser, upload.array("files"), uploadMultipleFiles);

export {router as uploadFilesRouter};