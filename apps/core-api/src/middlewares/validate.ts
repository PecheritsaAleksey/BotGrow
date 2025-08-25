import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

import { ApiError } from '../lib/errors';

export const validate =
  (schema: ZodSchema<unknown>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new ApiError(
          400,
          'bad_request',
          'Invalid request body',
          result.error.flatten(),
        ),
      );
    }
    req.body = result.data;
    next();
  };

export default validate;
