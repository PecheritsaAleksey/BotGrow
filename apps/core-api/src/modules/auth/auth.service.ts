import { userService } from '@botgrow/db';

import { signJwt } from '../../lib/jwt';
import { verifyTelegramAuth, toUserUpsert } from '../../lib/telegram';
import { config } from '../../config';
import { ApiError } from '../../lib/errors';

import type { TelegramAuthUser } from './auth.types';

class AuthService {
  async loginWithTelegram(payload: TelegramAuthUser) {
    const botToken = config.telegramBotToken;
    if (!botToken || !verifyTelegramAuth(payload, botToken)) {
      throw new ApiError(401, 'invalid_signature', 'Invalid signature');
    }
    const user = await userService.createOrUpdateByTelegram(
      toUserUpsert(payload),
    );
    const token = signJwt(
      { sub: user.id, tid: user.telegramId, username: user.username },
      config.jwtSecret,
      config.jwtExpires,
    );
    return { token, user };
  }

  async devLogin() {
    const user = await userService.createOrUpdateByTelegram(config.devUser);
    const token = signJwt(
      { sub: user.id, tid: user.telegramId, username: user.username },
      config.jwtSecret,
      config.jwtExpires,
    );
    return { token, user };
  }
}

export const authService = new AuthService();
export default authService;
