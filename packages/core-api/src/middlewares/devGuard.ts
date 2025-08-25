import { Request, Response, NextFunction } from 'express';

import { AppError } from '../lib/errors';

export function devGuard(_req: Request, _res: Response, next: NextFunction) {
  const devMode =
    process.env.DEV_MODE === 'true' || process.env.NODE_ENV !== 'production';
  if (!devMode) {
    return next(new AppError('forbidden', 'Forbidden', 403));
  }
  next();
}
