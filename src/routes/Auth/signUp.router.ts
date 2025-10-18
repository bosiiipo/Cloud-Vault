import {Router} from 'express';
import dotenv from 'dotenv';
import * as authController from '../../controllers/auth.controller';
import * as authValidator from '../../validations/auth.validation';
import {config} from '../../config';

dotenv.config();
const api = config.api;

const router = Router();
router.post(`${api}/auth/signup`, authValidator.validateRegister, authController.registerUser);

export {router as signUpRouter};
