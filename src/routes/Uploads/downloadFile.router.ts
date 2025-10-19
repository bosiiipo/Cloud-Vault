import {Router} from 'express';
import dotenv from 'dotenv';
import {authenticateUser} from '../../middlewares/auth.middleware';
import {generateDownloadUrl} from '../../controllers/upload.controller';
import {config} from '../../config';

dotenv.config();
const api = config.api;

const router = Router();

router.post(`${api}/download`, authenticateUser, generateDownloadUrl);

export {router as downloadFileRouter};
