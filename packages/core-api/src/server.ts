import dotenv from 'dotenv';

import app from './app';
import config from './config';
import logger from './lib/logger';

dotenv.config();

const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
