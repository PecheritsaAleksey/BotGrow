import express from 'express';

import webhookRoutes from './routes/webhook.routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(webhookRoutes);
  app.use(errorHandler);
  return app;
}
