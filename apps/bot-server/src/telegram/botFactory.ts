import { Telegraf } from 'telegraf';

import { registerHandlers } from './handlers';

type BotMeta = { id: string };

export function createBot(token: string, meta?: BotMeta) {
  const bot = new Telegraf(token, { handlerTimeout: 30_000 });
  registerHandlers(bot);
  return bot;
}
