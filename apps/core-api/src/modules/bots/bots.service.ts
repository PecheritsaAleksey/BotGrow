import { botService } from '@botgrow/db';

import { ApiError } from '../../lib/errors';
import { decryptToken, encryptToken, hashToken } from '../../lib/crypto';
import { config } from '../../config';

import { toBotDTO } from './bots.mapper';

function stripTrailingSlash(u: string): string {
  let s = u;
  while (s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
};

export class BotsService {
  async listBots(userId: string) {
    const bots = await botService.findAllByUser(userId);
    return bots.map((b) => toBotDTO(b).bot);
  }

  async createBot(
    userId: string,
    data: {
      name: string;
      description?: string | null;
      photoUrl?: string | null;
      botToken: string;
    },
  ) {
    const encryptedToken = encryptToken(data.botToken);
    const tokenHash = hashToken(data.botToken);
    const tokenLast4 = data.botToken.slice(-4);
    const bot = await botService.create({
      userId,
      name: data.name,
      description: data.description,
      photoUrl: data.photoUrl,
      encryptedToken,
      tokenHash,
      tokenLast4,
    });
    return toBotDTO(bot, data.botToken);
  }

  async getBot(userId: string, id: string) {
    const bot = await botService.findByIdForUser(id, userId);
    if (!bot) throw new ApiError(404, 'not_found', 'Bot not found');
    return toBotDTO(bot);
  }

  async updateBot(
    userId: string,
    id: string,
    patch: {
      name?: string;
      description?: string | null;
      photoUrl?: string | null;
      botToken?: string;
    },
  ) {
    const existing = await botService.findByIdForUser(id, userId);
    if (!existing) throw new ApiError(404, 'not_found', 'Bot not found');
    const data: Record<string, unknown> = {};
    let plain: string | undefined;
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.photoUrl !== undefined) data.photoUrl = patch.photoUrl;
    if (patch.botToken) {
      plain = patch.botToken;
      data.encryptedToken = encryptToken(patch.botToken);
      data.tokenHash = hashToken(patch.botToken);
      data.tokenLast4 = patch.botToken.slice(-4);
    }
    const updated = await botService.updateForUser(id, userId, data);
    if (!updated) throw new ApiError(404, 'not_found', 'Bot not found');
    return toBotDTO(updated, plain);
  }

  async deleteBot(userId: string, id: string) {
    const ok = await botService.deleteForUser(id, userId);
    if (!ok) throw new ApiError(404, 'not_found', 'Bot not found');
  }

  async connectBot(userId: string, id: string) {
    const bot = await botService.findByIdForUser(id, userId);
    if (!bot) throw new ApiError(404, 'not_found', 'Bot not found');

    const base = stripTrailingSlash(config.appBaseUrlBotServer);
    const url = `${base}/bot/${id}/webhook`;

    if (bot.status === 'connected' && bot.webhookUrl === url) {
      return { status: 'connected', webhookUrl: url };
    }

    const token = decryptToken(bot.encryptedToken);
    const apiBase = stripTrailingSlash(config.telegramApiBase);
    const resp = await fetch(`${apiBase}/bot${token}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        secret_token: config.webhookSecret,
        allowed_updates: ['message', 'my_chat_member', 'callback_query'],
      }),
    });
    let data: TelegramApiResponse | undefined;
    try {
      data = (await resp.json()) as TelegramApiResponse;
    } catch (_err) {
      /* ignore */
    }
    if (!resp.ok || !data?.ok) {
      await botService.updateForUser(id, userId, {
        status: 'error',
        lastError: data?.description,
      });
      throw new ApiError(
        502,
        'telegram_error',
        data?.description || 'Failed to set webhook',
      );
    }

    await botService.updateForUser(id, userId, {
      status: 'connected',
      webhookUrl: url,
      lastError: null,
    });
    return { status: 'connected', webhookUrl: url };
  }

  async disconnectBot(userId: string, id: string) {
    const bot = await botService.findByIdForUser(id, userId);
    if (!bot) throw new ApiError(404, 'not_found', 'Bot not found');

    if (bot.status === 'disconnected' && !bot.webhookUrl) {
      return { status: 'disconnected' };
    }

    const token = decryptToken(bot.encryptedToken);
    const apiBase = stripTrailingSlash(config.telegramApiBase);
    const resp = await fetch(`${apiBase}/bot${token}/deleteWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drop_pending_updates: true }),
    });
    let data: TelegramApiResponse | undefined;
    try {
      data = (await resp.json()) as TelegramApiResponse;
    } catch (_err) {
      /* ignore */
    }
    if (!resp.ok || !data?.ok) {
      await botService.updateForUser(id, userId, {
        status: 'error',
        lastError: data?.description,
      });
      throw new ApiError(
        502,
        'telegram_error',
        data?.description || 'Failed to delete webhook',
      );
    }

    await botService.updateForUser(id, userId, {
      status: 'disconnected',
      webhookUrl: null,
      lastError: null,
    });
    return { status: 'disconnected' };
  }
}

export const botsService = new BotsService();
export default botsService;
