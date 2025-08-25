import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes';
import botsRoutes from '../modules/bots/bots.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bots', botsRoutes);

export default router;
