import { getBotConfigFromDb } from '@botgrow/db';

export const botsService = {
  async resolveBot(botId: string) {
    const botConfig = await getBotConfigFromDb(botId);
    if (!botConfig) {
      throw Object.assign(new Error('Bot not found'), { status: 404 });
    }
    const token = botConfig.token;
    return { id: botConfig.id, token };
  },
};
