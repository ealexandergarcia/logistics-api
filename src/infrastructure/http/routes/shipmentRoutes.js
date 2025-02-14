import express from 'express';
import { registerShipment } from '../controllers/shipmentController.js';
import { jwtMiddleware } from '../middlewares/authMiddleware.js';
import { limit } from '../middlewares/rateLimiter.js';
import { versioning } from '../middlewares/versioning.js';
import handleValidationErrors from '../middlewares/errorHandler.js';
import { shipmentValidator } from '../validators/shipmentValidator.js';

const router = express.Router();

router.post('/register',limit('post'), versioning('1.0.0'),shipmentValidator,handleValidationErrors, jwtMiddleware, registerShipment);

export default router;