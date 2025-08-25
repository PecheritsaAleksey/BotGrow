import type { Request, Response, NextFunction } from 'express';

import { config } from '../config';
import { ApiError } from '../lib/errors';

export function devGuard(
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (config.devMode) return next();
  next(new ApiError(403, 'forbidden', 'Forbidden'));
}

export default devGuard;
