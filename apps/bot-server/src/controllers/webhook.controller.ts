import type { Request, Response, NextFunction } from 'express';

import { botsService } from '../domain/bots.service';
import { updateProcessor } from '../telegram/updateProcessor';
import { createBot } from '../telegram/botFactory';

export async function handleWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { botId } = req.params as { botId: string };

    const botConfig = await botsService.resolveBot(botId);

    const bot = createBot(botConfig.token, botConfig);

    await updateProcessor.process(botConfig.id, req.body);
    await bot.handleUpdate(req.body);

    res.status(200).send('OK');
  } catch (e) {
    next(e);
  }
}
