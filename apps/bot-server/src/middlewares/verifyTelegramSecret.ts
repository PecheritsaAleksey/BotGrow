import type { Request, Response, NextFunction } from 'express';

import { config } from '../config';

export function verifyTelegramSecret(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const secret = req.get('x-telegram-bot-api-secret-token');
  if (!secret || secret !== config.WEBHOOK_SECRET) {
    return res.status(401).send('Invalid webhook secret');
  }
  next();
}
