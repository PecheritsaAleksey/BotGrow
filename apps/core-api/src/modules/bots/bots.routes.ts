import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import type { ZodSchema } from 'zod';

import validate from '../../middlewares/validate';
import { authGuard } from '../../middlewares/authGuard';
import { ApiError } from '../../lib/errors';
import {
  listSubscribers,
  countSubscribers,
} from '../subscribers/subscribers.controller';

import {
  createBotSchema,
  updateBotSchema,
  idParamSchema,
} from './bots.validators';
import {
  listBots,
  createBot,
  getBot,
  updateBot,
  deleteBot,
  connectBot,
  disconnectBot,
} from './bots.controller';

const validateParams =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const r = schema.safeParse(req.params);
    if (!r.success) {
      return next(
        new ApiError(
          400,
          'bad_request',
          'Invalid request params',
          r.error.flatten(),
        ),
      );
    }
    req.params = r.data;
    next();
  };

const router = Router();

router.use(authGuard);

router.get('/', listBots);
router.post('/', validate(createBotSchema), createBot);
router.get('/:id', validateParams(idParamSchema), getBot);
router.put(
  '/:id',
  validateParams(idParamSchema),
  validate(updateBotSchema),
  updateBot,
);
router.delete('/:id', validateParams(idParamSchema), deleteBot);
router.post('/:id/connect', validateParams(idParamSchema), connectBot);
router.post('/:id/disconnect', validateParams(idParamSchema), disconnectBot);

// Subscribers endpoints
router.get('/:id/subscribers', validateParams(idParamSchema), listSubscribers);
router.get(
  '/:id/subscribers/count',
  validateParams(idParamSchema),
  countSubscribers,
);

export default router;
