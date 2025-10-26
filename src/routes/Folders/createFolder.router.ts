import {Router} from 'express';
import dotenv from 'dotenv';
import {authenticateUser} from '../../middlewares/auth.middleware';
import {createFolder} from '../../controllers/folder.controller';
import {config} from '../../config';

dotenv.config();

const api = config.api;

const router = Router();

router.post(`${api}/folder`, authenticateUser, createFolder);

export {router as createFolderRouter};
