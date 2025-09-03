import type { Telegraf } from 'telegraf';

import { registerStart } from './command.start';
import { registerHelp } from './command.help';
import { registerEcho } from './message.echo';

type BotMeta = { id: string };

export function registerHandlers(bot: Telegraf, meta?: BotMeta) {
  registerStart(bot, meta);
  registerHelp(bot);
  registerEcho(bot);
}
