import {config} from './config';
import logger from './lib/logger';
import app from './app';

app.listen(config.port, () => {
  logger.info({message: `Server started on port ${config.port}`}, 'SERVER_RUNNING');
});
