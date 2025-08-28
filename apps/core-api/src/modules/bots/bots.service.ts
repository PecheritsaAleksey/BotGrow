import { botService } from '@botgrow/db';

import { ApiError } from '../../lib/errors';
import { encryptToken, hashToken } from '../../lib/crypto';

import { toBotDTO } from './bots.mapper';

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
}

export const botsService = new BotsService();
export default botsService;
