import { Router } from 'express';

import validate from '../../middlewares/validate';
import devGuard from '../../middlewares/devGuard';

import { telegramLogin, devLogin } from './auth.controller';
import { telegramAuthSchema } from './auth.validators';

const router = Router();

router.post('/telegram', validate(telegramAuthSchema), telegramLogin);
router.post('/dev-login', devGuard, devLogin);

export default router;
