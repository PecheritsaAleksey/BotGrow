import { config } from './config';
import app from './app';
import { logger } from './lib/logger';

const { port } = config;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
