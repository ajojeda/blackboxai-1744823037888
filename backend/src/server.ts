import App from './app';
import logger from './utils/logger';

const startServer = async () => {
  try {
    const app = new App();
    await app.start();

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received. Starting graceful shutdown...');
      await app.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received. Starting graceful shutdown...');
      await app.shutdown();
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
