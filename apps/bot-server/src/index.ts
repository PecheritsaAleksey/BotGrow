import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Telegraf } from 'telegraf';

type BotConfig = {
  token: string;
  greeting: string;
};

const botConfigs = new Map<string, BotConfig>([
  [
    'testbot1',
    {
      token: process.env.BOT_TOKEN ?? '123456789:AAbot_token_1',
      greeting: '👋 Hello from Test Bot 1!',
    },
  ],
  [
    'testbot2',
    {
      token: '987654321:BBbot_token_2',
      greeting: '👋 Welcome from Test Bot 2!',
    },
  ],
]);

const app = express();
app.use(express.json());

app.post('/bot/:botId/webhook', async (req, res) => {
  const { botId } = req.params;
  const config = botConfigs.get(botId);

  console.log('Config for botId:', botId, 'is', config);

  if (!config) {
    res.status(404).send('Bot not found');
    return;
  }

  const bot = new Telegraf(config.token);
  bot.start((ctx) => ctx.reply(config.greeting));

  await bot.handleUpdate(req.body);
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Bot server listening on port 3000');
});
