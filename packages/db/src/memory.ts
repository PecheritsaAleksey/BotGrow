import { BotConfig } from './types';

const bots = new Map<string, BotConfig>();

export const getBotConfig = (botId: string): BotConfig | undefined => {
  return bots.get(botId);
};

export const addBot = (botId: string, config: BotConfig): void => {
  bots.set(botId, config);
};
