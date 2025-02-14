import express from 'express';
import { registerShipment, assignShipment } from '../controllers/shipmentController.js';
import { shipmentValidator, shipmentAssignmentValidator } from '../validators/shipmentValidator.js';
import { handleValidationErrors } from '../middlewares/errorHandler.js';
import { jwtMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import { limit } from '../middlewares/rateLimiter.js';
import { versioning } from '../middlewares/versioning.js';

const router = express.Router();

router.post('/register',limit('post'), versioning('1.0.0'),shipmentValidator,handleValidationErrors, jwtMiddleware, registerShipment);
router.post('/assign',limit('post'),versioning('1.0.0'),jwtMiddleware,adminMiddleware,shipmentAssignmentValidator,handleValidationErrors,assignShipment);
export default router;