/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
interface UserService {
  createOrUpdateByTelegram(data: {
    telegramId: number;
    username?: string;
    firstName: string;
    lastName?: string;
    photoUrl?: string;
  }): Promise<unknown>;
}
const { userService } = require('@botgrow/db') as { userService: UserService };
/* eslint-enable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
import { signJwt } from '../../lib/jwt';
import { verifyTelegramAuth, toUserUpsert } from '../../lib/telegram';
import { AppError } from '../../lib/errors';
import config from '../../config';

import { TelegramAuthBody, AuthResult } from './auth.types';

export async function telegramLogin(
  body: TelegramAuthBody,
): Promise<AuthResult> {
  if (
    !config.telegramBotToken ||
    !verifyTelegramAuth(body, config.telegramBotToken)
  ) {
    throw new AppError('invalid_signature', 'Invalid signature', 401);
  }

  const user = await userService.createOrUpdateByTelegram(toUserUpsert(body));
  const token = signJwt(
    { sub: user.id, tid: user.telegramId, username: user.username },
    config.jwtSecret,
    config.jwtExpires,
  );
  return { token, user };
}

export async function devLogin(): Promise<AuthResult> {
  const dev = {
    telegramId: Number(process.env.DEV_USER_TELEGRAM_ID || 999999),
    username: process.env.DEV_USER_USERNAME || 'devuser',
    firstName: process.env.DEV_USER_FIRST_NAME || 'Dev',
    lastName: process.env.DEV_USER_LAST_NAME || 'User',
    photoUrl: process.env.DEV_USER_PHOTO_URL,
  };

  const user = await userService.createOrUpdateByTelegram(dev);
  const token = signJwt(
    { sub: user.id, tid: user.telegramId, username: user.username },
    config.jwtSecret,
    config.jwtExpires,
  );
  return { token, user };
}
