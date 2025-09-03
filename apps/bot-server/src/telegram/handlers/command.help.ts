import type { Telegraf } from 'telegraf';

export function registerHelp(bot: Telegraf) {
  bot.help(async (ctx) => {
    await ctx.reply(
      'Available commands:\n/start - welcome message\n/help - this help',
    );
  });
}
