import { Bot as PrismaBot } from '@prisma/client';

type Bot = PrismaBot & {
  status: string;
  webhookUrl: string | null;
  lastError: string | null;
};

import { prisma } from '../prisma';
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
    return prisma.bot.create({ data });
  },

  findAllByUser(userId: string): Promise<Bot[]> {
    return prisma.bot.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  },

  findByIdForUser(id: string, userId: string): Promise<Bot | null> {
    return prisma.bot.findFirst({ where: { id, userId } });
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
    const res = await prisma.bot.updateMany({ where: { id, userId }, data });
    if (!res.count) return null;
    return prisma.bot.findUnique({ where: { id } });
  },

  async deleteForUser(id: string, userId: string): Promise<boolean> {
    const res = await prisma.bot.deleteMany({ where: { id, userId } });
    return res.count > 0;
  },
};

export async function getBotConfigFromDb(
  botId: string,
): Promise<BotConfig | null> {
  const bot = await prisma.bot.findUnique({ where: { id: botId } });
  if (!bot) return null;

  const token = decryptToken(bot.encryptedToken);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const welcome: string | undefined = (bot as any).welcomeMessage;

  return {
    token,
    greeting: welcome ? { type: 'text', payload: welcome } : undefined,
  } as BotConfig;
}
