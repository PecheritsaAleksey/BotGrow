import type { Telegraf } from 'telegraf';

type BotMeta = { id: string } | undefined;

export function registerStart(bot: Telegraf, meta?: BotMeta) {
  bot.start(async (ctx) => {
    const msg = 'Welcome!';
    await ctx.reply(msg);
  });
}
