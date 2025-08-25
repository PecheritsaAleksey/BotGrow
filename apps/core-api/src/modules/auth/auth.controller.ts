import type { Request, Response, NextFunction } from 'express';

import { authService } from './auth.service';
import type { TelegramAuthUser } from './auth.types';

export async function telegramLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.body as TelegramAuthUser;
    const data = await authService.loginWithTelegram(body);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function devLogin(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await authService.devLogin();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}
