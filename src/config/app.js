import express from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from '../infrastructure/http/middlewares/errorHandler.js';
import userRoutes from '../infrastructure/http/routes/userRoutes.js';
import shipmentRoutes from '../infrastructure/http/routes/shipmentRoutes.js';
import swaggerSpecs from '../swagger/swagger.js';

/**
 * Configures and initializes the Express application.
 * 
 * This file sets up the Express app, configures middleware, defines routes,
 * and integrates Swagger for API documentation.
 * 
 * @module app
 */
const app = express();

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Define API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/shipments', shipmentRoutes);

// Global error handler
app.use(errorHandler);

/**
 * Creates and returns the configured Express application.
 * 
 * @returns {express.Application} - The configured Express app.
 */
export const createApp = () => app;