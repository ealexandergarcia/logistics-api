import express from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import errorHandler from '../infrastructure/http/middlewares/errorHandler.js';
import userRoutes from '../infrastructure/http/routes/userRoutes.js';
import shipmentRoutes from '../infrastructure/http/routes/shipmentRoutes.js';
import swaggerSpecs from '../swagger/swagger.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  app.use("/api/v1/users", userRoutes);
  app.use('/api/v1/shipments', shipmentRoutes);
  app.use(errorHandler);

  return app;
};