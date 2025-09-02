import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { subscriberService, botService } from '@botgrow/db';

const uuidParam = z.object({ id: z.string().uuid() });
const paging = z.object({
  skip: z.coerce.number().int().min(0).optional(),
  take: z.coerce.number().int().min(1).max(500).optional(),
});

export async function listSubscribers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParam.parse(req.params);
    const { skip, take } = paging.parse(req.query);
    const userId = req.user!.id as string;

    const bot = await botService.findByIdForUser(id, userId);
    if (!bot) return res.status(404).json({ message: 'Bot not found' });

    const items = await subscriberService.list(id, { skip, take });
    res.status(200).json(items);
  } catch (e) {
    next(e);
  }
}

export async function countSubscribers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = uuidParam.parse(req.params);
    const userId = req.user!.id as string;

    const bot = await botService.findByIdForUser(id, userId);
    if (!bot) return res.status(404).json({ message: 'Bot not found' });

    const count = await subscriberService.count(id);
    res.status(200).json({ count });
  } catch (e) {
    next(e);
  }
}
