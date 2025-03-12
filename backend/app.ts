import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { sanitizeRequest } from './config/database-security';
import routes from './api/routes';
import { errorHandler } from './api/middlewares/error.middleware';

function createApp(): Application {
  const app: Application = express();

  // Middleware
  app.use(helmet()); // Security headers
  app.use(cors()); // Enable CORS
  app.use(compression()); // Compress responses
  app.use(json({ limit: '10mb' })); // Parse JSON requests
  app.use(urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded requests
  app.use(sanitizeRequest); // Sanitize MongoDB queries

  // API Routes
  app.use('/api', routes);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export default createApp;
