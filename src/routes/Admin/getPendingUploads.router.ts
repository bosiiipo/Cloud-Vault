import { Router } from 'express';
import { authenticateUser, requireAdmin } from '../../middlewares/auth.middleware';
import * as adminController from '../../controllers/admin.controller'
import dotenv from 'dotenv';
import { config } from '../../config';

dotenv.config();

const api = config.api;

const router = Router();

router.get(`${api}/pending`, authenticateUser, requireAdmin, adminController.getPendingFiles);

export { router as getPendingFilesRouter };
