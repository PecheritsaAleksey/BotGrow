import { Bot as PrismaBot } from '@prisma/client';

type Bot = PrismaBot & {
  status: string;
  webhookUrl: string | null;
  lastError: string | null;
};

import { botRepository } from '../repositories/BotRepository';
import { decryptToken } from '../lib/crypto';
import type { BotConfig } from '../types';

export const botService = {
  create(data: {
    userId: string;
    name: string;
    description?: string | null;
    photoUrl?: string | null;
    encryptedToken: string;
    tokenHash: string;
    tokenLast4?: string;
  }): Promise<Bot> {
    // repository expects Bot-like shape; casting aligns with current service input
    return botRepository.create(
      data as unknown as Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>,
    );
  },

  findAllByUser(userId: string): Promise<Bot[]> {
    return botRepository.findAllByUser(userId);
  },

  findByIdForUser(id: string, userId: string): Promise<Bot | null> {
    return botRepository.findByIdForUser(id, userId);
  },

  async updateForUser(
    id: string,
    userId: string,
    data: Partial<
      Pick<
        Bot,
        | 'name'
        | 'description'
        | 'photoUrl'
        | 'encryptedToken'
        | 'tokenHash'
        | 'tokenLast4'
        | 'status'
        | 'webhookUrl'
        | 'lastError'
      >
    >,
  ): Promise<Bot | null> {
    const found = await botRepository.findByIdForUser(id, userId);
    if (!found) return null;
    return botRepository.updateForUser(id, userId, data as Partial<Bot>);
  },

  async deleteForUser(id: string, userId: string): Promise<boolean> {
    const found = await botRepository.findByIdForUser(id, userId);
    if (!found) return false;
    await botRepository.deleteForUser(id, userId);
    return true;
  },
};

export async function getBotConfigFromDb(
  botId: string,
): Promise<BotConfig | null> {
  const bot = await botRepository.findById(botId);
  if (!bot) return null;

  const token = decryptToken(bot.encryptedToken);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const welcome: string | undefined = (bot as any).welcomeMessage;

  return {
    token,
    greeting: welcome ? { type: 'text', payload: welcome } : undefined,
  } as BotConfig;
}
