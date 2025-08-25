import { Router } from 'express';
import { z } from 'zod';
import { userService } from '@botgrow/db';

import {
  TelegramAuthUser,
  verifyTelegramAuth,
  toUserUpsert,
} from '../utils/telegram';
import { signJwt } from '../utils/jwt';

const router = Router();

const telegramSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string(),
});

router.post('/telegram', async (req, res) => {
  let body: TelegramAuthUser;
  try {
    body = telegramSchema.parse(req.body);
  } catch {
    return res.status(400).json({ error: 'bad_request' });
  }

  const botToken = process.env.AUTH_TELEGRAM_BOT_TOKEN;
  if (!botToken || !verifyTelegramAuth(body, botToken)) {
    return res.status(401).json({ error: 'invalid_signature' });
  }

  try {
    const user = await userService.createOrUpdateByTelegram(toUserUpsert(body));
    const token = signJwt(
      { sub: user.id, tid: user.telegramId, username: user.username },
      process.env.JWT_SECRET!,
      process.env.JWT_EXPIRES || '7d',
    );
    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal' });
  }
});

router.post('/dev-login', async (_req, res) => {
  const devMode =
    process.env.DEV_MODE === 'true' || process.env.NODE_ENV !== 'production';
  if (!devMode) return res.status(403).json({ error: 'forbidden' });

  const dev = {
    telegramId: Number(process.env.DEV_USER_TELEGRAM_ID || 999999),
    username: process.env.DEV_USER_USERNAME || 'devuser',
    firstName: process.env.DEV_USER_FIRST_NAME || 'Dev',
    lastName: process.env.DEV_USER_LAST_NAME || 'User',
    photoUrl: process.env.DEV_USER_PHOTO_URL,
  };

  try {
    const user = await userService.createOrUpdateByTelegram(dev);
    const token = signJwt(
      { sub: user.id, tid: user.telegramId, username: user.username },
      process.env.JWT_SECRET!,
      process.env.JWT_EXPIRES || '7d',
    );
    res.json({ token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal' });
  }
});

export default router;
