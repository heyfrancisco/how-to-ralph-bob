import { createApp } from './app';
import { logger } from './utils/logger';

// Load environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start the Express server
 */
function startServer(): void {
  const app = createApp();

  const server = app.listen(PORT, () => {
    logger.info(`Server started successfully`, {
      port: PORT,
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled rejection', { reason });
    process.exit(1);
  });
}

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}

export { startServer };