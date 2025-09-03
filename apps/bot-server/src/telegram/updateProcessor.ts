import { subscriberService } from '@botgrow/db';

export const updateProcessor = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async process(botId: string, update: any) {
    const msg = update?.message;
    if (msg?.from) {
      await subscriberService.upsertSeen({
        botId,
        telegramId: msg.from.id,
        username: msg.from.username ?? null,
        firstName: msg.from.first_name ?? null,
        lastName: msg.from.last_name ?? null,
        language: msg.from.language_code ?? null,
      });
    }

    const mcm = update?.my_chat_member;
    if (mcm?.from && mcm?.chat?.type === 'private') {
      await subscriberService.upsertSeen({
        botId,
        telegramId: mcm.from.id,
        username: mcm.from.username ?? null,
        firstName: mcm.from.first_name ?? null,
        lastName: mcm.from.last_name ?? null,
        language: mcm.from.language_code ?? null,
      });
    }
  },
};
