import {Router} from 'express';
import dotenv from 'dotenv';
import {authenticateUser} from '../../middlewares/auth.middleware';
import {downloadFile} from '../../controllers/upload.controller';
import {config} from '../../config';

dotenv.config();
const api = config.api;

const router = Router();

router.post(`${api}/download`, authenticateUser, downloadFile);

export {router as downloadFileRouter};
