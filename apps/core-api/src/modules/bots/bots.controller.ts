import type { Request, Response, NextFunction } from 'express';

import { botsService } from './bots.service';

export async function listBots(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bots = await botsService.listBots(req.user!.id);
    res.json({ ok: true, data: { bots } });
  } catch (err) {
    next(err);
  }
}

export async function createBot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await botsService.createBot(req.user!.id, req.body);
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getBot(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const result = await botsService.getBot(req.user!.id, id);
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateBot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    const result = await botsService.updateBot(req.user!.id, id, req.body);
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteBot(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    await botsService.deleteBot(req.user!.id, id);
    res.json({ ok: true, data: {} });
  } catch (err) {
    next(err);
  }
}
