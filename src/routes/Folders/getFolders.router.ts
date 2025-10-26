import {Router} from 'express';
import dotenv from 'dotenv';
import {authenticateUser} from '../../middlewares/auth.middleware';
import {getAllFolders} from '../../controllers/folder.controller';
import {config} from '../../config';

dotenv.config();

const api = config.api;

const router = Router();

router.get(`${api}/folder`, authenticateUser, getAllFolders);

export {router as getFoldersRouter};
