import { Request, Response } from 'express';

import { AppError } from '../lib/errors';
import logger from '../lib/logger';

export function errorHandler(err: Error, _req: Request, res: Response) {
  const appErr =
    err instanceof AppError
      ? err
      : new AppError('internal', 'Internal server error', 500);

  if (!(err instanceof AppError)) {
    logger.error(err);
  }

  const body: Record<string, unknown> = {
    ok: false,
    error: { code: appErr.code, message: appErr.message },
  };
  if (appErr.details) body.details = appErr.details;

  res.status(appErr.status).json(body);
}
