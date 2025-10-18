import {Router} from 'express';
import dotenv from 'dotenv';
import * as authController from '../../controllers/auth.controller';
import {config} from '../../config';
import {authenticateUser} from '../../middlewares/auth.middleware';

dotenv.config();

const api = config.api;

const router = Router();

router.post(`${api}/auth/signOut`, authenticateUser, authController.logout);

export {router as signOutRouter};
