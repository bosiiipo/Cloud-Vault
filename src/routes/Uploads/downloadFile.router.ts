import {Router} from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import {authenticateUser} from '../../middlewares/auth.middleware';
import {generateDownloadUrl} from '../../controllers/upload.controller';
import {config} from '../../config';

dotenv.config();
const api = config.api;

const router = Router();

const upload = multer();

router.post(`${api}/download`, authenticateUser, upload.single('file'), generateDownloadUrl);

export {router as downloadFileRouter};
