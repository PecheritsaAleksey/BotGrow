import { User } from '@prisma/client';

import { prisma } from '../prisma';
import { BaseRepository } from '../repositories/BaseRepository';

export class UserService extends BaseRepository<User, 'id'> {
  constructor() {
    super(prisma.user, 'id');
  }

  findByTelegramId(telegramId: number) {
    return this.model.findUnique({ where: { telegramId } });
  }

  async createOrUpdateByTelegram(data: {
    telegramId: number;
    username?: string;
    firstName: string;
    lastName?: string;
    photoUrl?: string;
  }) {
    return this.model.upsert({
      where: { telegramId: data.telegramId },
      update: data,
      create: data,
    });
  }
}

export const userService = new UserService();
