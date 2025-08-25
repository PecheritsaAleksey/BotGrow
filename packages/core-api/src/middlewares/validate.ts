import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

import { AppError } from '../lib/errors';

export const validate =
  (
    schema: ZodSchema<unknown>,
    property: 'body' | 'query' | 'params' = 'body',
  ) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const value = (req as Record<string, unknown>)[property];
      const parsed = schema.parse(value);
      (req as Record<string, unknown>)[property] = parsed;
      next();
    } catch (err) {
      next(new AppError('bad_request', 'Validation error', 400, err));
    }
  };
