import {Router} from 'express';
import dotenv from 'dotenv';
import {authenticateUser} from '../../middlewares/auth.middleware';
import {getFolder} from '../../controllers/folder.controller';
import {config} from '../../config';

dotenv.config();

const api = config.api;

const router = Router();

router.get(
  `${api}/folder/:folderId`,
  authenticateUser,
  getFolder,
);

export {router as getFolderRouter};
