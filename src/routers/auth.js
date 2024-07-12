import { Router } from 'express';
import ctrlWrapper from '../utils/ctrWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { validateBody } from '../middleware/validateBody.js';
import { userLoginSchema, userValidationShema } from '../validation/auth.js';
import { requestResetEmailShema } from '../validation/requestResetEmailShema.js';
import { resetPasswordSchema } from '../validation/resetPasswordSchema.js';

const router = Router();

router.post(
  '/register',
  validateBody(userValidationShema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logaut', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshTokenController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailShema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default router;
