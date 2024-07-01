import { Router } from 'express';
import ctrlWrapper from '../utils/ctrWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from '../controllers/auth.js';
import { validateBody } from '../middleware/validateBody.js';
import { userLoginSchema, userValidationShema } from '../validation/auth.js';

const router = Router();

router.post('/register', validateBody(userValidationShema), ctrlWrapper(registerUserController));
router.post('/login', validateBody(userLoginSchema), ctrlWrapper(loginUserController));
router.post('/logaut', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshTokenController));

export default router;
