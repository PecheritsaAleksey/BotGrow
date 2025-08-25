import type { Request, Response, NextFunction } from 'express';

import { ApiError } from '../lib/errors';
import { logger } from '../lib/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    const payload: Record<string, unknown> = {
      ok: false,
      error: { code: err.code, message: err.message },
    };
    if (err.details) payload.details = err.details;
    res.status(err.status).json(payload);
    return;
  }

  logger.error(err);
  res
    .status(500)
    .json({
      ok: false,
      error: { code: 'internal', message: 'Internal server error' },
    });
}
