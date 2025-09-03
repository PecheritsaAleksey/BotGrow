import type { Telegraf } from 'telegraf';

export function registerEcho(bot: Telegraf) {
  bot.on('text', async (ctx) => {
    await ctx.reply(ctx.message.text);
  });
}
