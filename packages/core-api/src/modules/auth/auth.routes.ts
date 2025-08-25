import { Router } from 'express';

import { validate } from '../../middlewares/validate';
import { devGuard } from '../../middlewares/devGuard';

import * as controller from './auth.controller';
import { telegramLoginSchema } from './auth.validators';

const router = Router();

router.post(
  '/telegram',
  validate(telegramLoginSchema),
  controller.telegramLogin,
);
router.post('/dev-login', devGuard, controller.devLogin);

export default router;
