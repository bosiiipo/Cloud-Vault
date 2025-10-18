import {Router} from 'express';
import dotenv from 'dotenv';
import {authenticateUser, requireAdmin} from '../../middlewares/auth.middleware';
import {config} from '../../config';
import * as adminController from '../../controllers/admin.controller';

dotenv.config();

const api = config.api;

const router = Router();

router.post(
  `${api}/admin/file/:fileId/flag`,
  authenticateUser,
  requireAdmin,
  adminController.flagFile,
);

export {router as flagFileRouter};
