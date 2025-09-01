import { Bot as PrismaBot } from '@prisma/client';

type Bot = PrismaBot & {
  status: string;
  webhookUrl: string | null;
  lastError: string | null;
};

import { maskToken, maskTokenFromLast4 } from '../../lib/crypto';

export type BotDTO = {
  id: string;
  name: string;
  description?: string | null;
  photoUrl?: string | null;
  tokenMasked: string;
  status: string;
  webhookUrl?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function toBotDTO(
  bot: Bot,
  plainToken?: string,
): {
  bot: BotDTO;
  plainBotToken?: string;
} {
  const tokenMasked = plainToken
    ? maskToken(plainToken)
    : maskTokenFromLast4(bot.tokenLast4);

  const dto: BotDTO = {
    id: bot.id,
    name: bot.name,
    description: bot.description,
    photoUrl: bot.photoUrl,
    tokenMasked,
    status: bot.status,
    webhookUrl: bot.webhookUrl,
    lastError: bot.lastError,
    createdAt: bot.createdAt.toISOString(),
    updatedAt: bot.updatedAt.toISOString(),
  };

  const res: { bot: BotDTO; plainBotToken?: string } = { bot: dto };
  if (plainToken) res.plainBotToken = plainToken;
  return res;
}
