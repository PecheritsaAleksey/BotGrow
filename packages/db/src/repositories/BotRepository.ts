import type { Bot, Prisma } from '@prisma/client';

import { prisma } from '../prisma';

import { BaseRepository } from './BaseRepository';

export class BotRepository extends BaseRepository<Bot, 'id'> {
  constructor() {
    // Pass the Prisma model delegate and id field to the base repository
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super((prisma as any).bot, 'id');
  }

  findAllByUser(userId: string): Promise<Bot[]> {
    return this.model.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  findByIdForUser(id: string, userId: string): Promise<Bot | null> {
    return this.model.findFirst({ where: { id, userId } });
  }

  updateForUser(
    id: string,
    // userId included for API clarity; enforcement happens in service layer
    _userId: string,
    data: Partial<Bot>,
  ): Promise<Bot> {
    // Prisma doesn't support composite where in update; ensure ownership in service layer
    return this.model.update({
      where: { id },
      data: data as Prisma.BotUpdateInput,
    });
  }

  create(data: Omit<Bot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bot> {
    return this.model.create({
      data: data as unknown as Prisma.BotCreateInput,
    });
  }

  deleteForUser(id: string, _userId: string): Promise<Bot> {
    // Ensure ownership check is handled in service layer
    return this.model.delete({ where: { id } });
  }
}

export const botRepository = new BotRepository();
