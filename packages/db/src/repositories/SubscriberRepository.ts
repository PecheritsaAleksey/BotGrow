import type { PrismaClient, Subscriber } from '@prisma/client';

import { BaseRepository } from './BaseRepository';

export class SubscriberRepository extends BaseRepository<Subscriber, 'id'> {
  constructor(private readonly prismaClient: PrismaClient) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super((prismaClient as any).subscriber, 'id');
  }

  upsertByTelegramId(
    botId: string,
    telegramId: number,
    data: Partial<Subscriber>,
  ) {
    return this.prismaClient.subscriber.upsert({
      where: { botId_telegramId: { botId, telegramId } },
      create: { botId, telegramId, ...data },
      update: { ...data },
    });
  }

  listByBot(botId: string, opts?: { skip?: number; take?: number }) {
    return this.model.findMany({
      where: { botId },
      orderBy: { lastSeenAt: 'desc' },
      skip: opts?.skip,
      take: opts?.take ?? 50,
    });
  }

  countByBot(botId: string) {
    return this.prismaClient.subscriber.count({ where: { botId } });
  }
}
