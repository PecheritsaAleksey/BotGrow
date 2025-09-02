import dotenv from 'dotenv';
import express from 'express';
import { Telegraf } from 'telegraf';
import { getBotConfigFromDb, subscriberService } from '@botgrow/db';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/bot/:botId/webhook', async (req, res) => {
  const secret = req.get('x-telegram-bot-api-secret-token');

  console.log('Received message:', req.body);

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).send('Invalid webhook secret');
  }

  const { botId } = req.params;
  const config = await getBotConfigFromDb(botId);

  if (!config) {
    res.status(404).send('Bot not found');
    return;
  }

  const bot = new Telegraf(config.token);
  bot.start((ctx) => {
    if (config.greeting?.type === 'text') {
      ctx.reply(config.greeting.payload);
    }

    if (!config.greeting?.type) {
      ctx.reply('Welcome!');
    }
  });

  const update = req.body;

  // Upsert subscriber on message updates
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

  // Membership updates (e.g., user blocks/unblocks bot in private chat)
  const myChatMember = update?.my_chat_member;
  if (myChatMember?.from && myChatMember?.chat?.type === 'private') {
    const tgId: number = myChatMember.from.id;
    await subscriberService.upsertSeen({
      botId,
      telegramId: tgId,
      username: myChatMember.from.username ?? null,
      firstName: myChatMember.from.first_name ?? null,
      lastName: myChatMember.from.last_name ?? null,
      language: myChatMember.from.language_code ?? null,
    });
    // Note: upsertSeen marks isActive=true. A hard flip based on status can be added later.
  }

  await bot.handleUpdate(update);
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Bot server listening on port 3000');
});
