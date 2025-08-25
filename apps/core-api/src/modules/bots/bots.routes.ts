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

export default router;
