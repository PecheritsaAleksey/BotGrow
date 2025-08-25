import type { Request, Response, NextFunction } from 'express';

import { verifyJwt } from '../lib/jwt';
import { ApiError } from '../lib/errors';
import { config } from '../config';

export function authGuard(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'unauthorized', 'Missing token'));
  }
  const token = header.slice(7);
  try {
    const payload = verifyJwt<{ sub: string; tid?: number; username?: string }>(
      token,
      config.jwtSecret,
    );
    req.user = {
      id: payload.sub,
      telegramId: payload.tid,
      username: payload.username,
    };
    next();
  } catch {
    next(new ApiError(401, 'unauthorized', 'Invalid token'));
  }
}

export default authGuard;
