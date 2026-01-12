import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import userRoutes from './routes/userRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(cors());

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      query: req.query,
      ip: req.ip,
    });
    next();
  });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Swagger API documentation
  try {
    const openApiPath = path.join(__dirname, '../docs/openapi.yaml');
    const openApiDocument = yaml.load(fs.readFileSync(openApiPath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument as object));
    logger.info('Swagger UI available at /api-docs');
  } catch (error) {
    logger.error('Failed to load OpenAPI specification', { error });
  }

  // API routes
  app.use('/api/users', userRoutes);

  // 404 handler (must be after all routes)
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}

// Export default app instance for testing
const app = createApp();
export default app;
