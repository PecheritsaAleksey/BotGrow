import { Request, Response, NextFunction } from 'express';

import * as authService from './auth.service';
import { TelegramAuthBody } from './auth.types';

export async function telegramLogin(
  req: Request<unknown, unknown, TelegramAuthBody>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.telegramLogin(req.body);
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function devLogin(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await authService.devLogin();
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
}
