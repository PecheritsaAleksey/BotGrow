import type { Subscriber } from '@prisma/client';

import { prisma } from '../prisma';
import { SubscriberRepository } from '../repositories/SubscriberRepository';

const repo = new SubscriberRepository(prisma);

export const subscriberService = {
  upsertSeen(params: {
    botId: string;
    telegramId: number;
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    language?: string | null;
    photoUrl?: string | null;
  }): Promise<Subscriber> {
    const { botId, telegramId, ...rest } = params;
    return repo.upsertByTelegramId(botId, telegramId, {
      ...rest,
      lastSeenAt: new Date(),
      isActive: true,
    });
  },

  list(botId: string, opts?: { skip?: number; take?: number }) {
    return repo.listByBot(botId, opts);
  },

  count(botId: string) {
    return repo.countByBot(botId);
  },

  // optional helpers for future broadcast eligibility:
  listActive(botId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return repo.findMany({ botId, isActive: true } as any);
  },
};
