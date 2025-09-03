import { Router } from 'express';

import { verifyTelegramSecret } from '../middlewares/verifyTelegramSecret';
import { handleWebhook } from '../controllers/webhook.controller';

const router = Router();

router.post('/bot/:botId/webhook', verifyTelegramSecret, handleWebhook);

export default router;
