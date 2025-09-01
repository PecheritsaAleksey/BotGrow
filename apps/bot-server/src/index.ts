import dotenv from 'dotenv';
import express from 'express';
import { Telegraf } from 'telegraf';
import { addBot, getBotConfig } from '@botgrow/db';

dotenv.config();

addBot('testbot1', {
  token: process.env.BOT_TOKEN as string,
  greeting: {
    type: 'text',
    payload: '👋 Hello from DB!',
  },
});

const app = express();
app.use(express.json());

app.post('/bot/:botId/webhook', async (req, res) => {
  const secret = req.get('x-telegram-bot-api-secret-token');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).send('Invalid webhook secret');
  }

  const { botId } = req.params;
  const config = getBotConfig(botId);

  console.log('Config for botId:', botId, 'is', config);

  if (!config) {
    res.status(404).send('Bot not found');
    return;
  }

  const bot = new Telegraf(config.token);
  bot.start((ctx) => {
    if (config.greeting.type === 'text') {
      ctx.reply(config.greeting.payload);
    }
  });

  await bot.handleUpdate(req.body);
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Bot server listening on port 3000');
});
