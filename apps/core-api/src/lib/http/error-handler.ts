import type { ErrorRequestHandler } from 'express';

import { logger } from '../logger';

type MaybeApiError = {
  status?: number;
  code?: unknown;
  message?: string;
  details?: unknown;
};

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req,
  res,
  _next,
) => {
  void _next;
  logger.error(err);

  const e = err as MaybeApiError;
  const status = typeof e.status === 'number' ? e.status : 500;

  const body: Record<string, unknown> = {
    message: e.message || 'Internal Server Error',
  };

  if (e.code) body.code = String(e.code);
  if (process.env.NODE_ENV !== 'production' && e.details)
    body.details = e.details;

  res.status(status).json(body);
};
