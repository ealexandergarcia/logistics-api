import request from 'supertest';
import { createApp } from '../../../../config/app.js';
import redisClient from '../../../../config/redisClient.js';
import ShipmentRepository from '../../../../domain/repositories/shipmentRepository.js';
import { jwtMiddleware } from '../../middlewares/authMiddleware.js';
import { assignShipment } from '../../../../application/use-cases/assignShipmentUseCase.js';

// Mock all required middleware and handlers
jest.mock('../../../../infrastructure/http/middlewares/authMiddleware.js', () => ({
  jwtMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next())
}));

jest.mock('../../../../infrastructure/http/middlewares/rateLimiter.js', () => ({
  limit: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../../../../infrastructure/http/middlewares/versioning.js', () => ({
  versioning: jest.fn(() => (req, res, next) => next())
}));

jest.mock('../../../../infrastructure/http/middlewares/errorHandler.js', () => ({
  handleValidationErrors: jest.fn((req, res, next) => next()),
  errorHandler: jest.fn((err, req, res, next) => {
    res.status(500).json({ message: 'Internal server error' });
  })
}));

// Mock the assignShipment use case
jest.mock('../../../../application/use-cases/assignShipmentUseCase.js', () => ({
  assignShipment: jest.fn((req, res) => res.status(200).json({ message: 'Shipment assigned successfully' }))
}));

jest.mock('../../../../domain/repositories/shipmentRepository.js');
jest.mock('../../../../config/redisClient.js');

const app = createApp();

describe('Shipment Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jwtMiddleware.mockImplementation((req, res, next) => {
      req.user = {
        id: 1,
        role: 'admin'
      };
      next();
    });
  });

  describe('GET /api/v1/shipments/status/:id', () => {
    it('should return the shipment status from Redis', async () => {
      const shipmentId = '1';
      const shipmentData = {
        package: { id: 1, weight: 10, length: 10, width: 10, height: 10, productType: 'Electronics' },
        route: { id: 1, name: 'Route 1' },
        status: 'In Transit',
        updatedAt: '2025-02-13T06:59:44.000Z'
      };

      redisClient.hGetAll.mockResolvedValueOnce(shipmentData);

      const response = await request(app)
        .get(`/api/v1/shipments/status/${shipmentId}`)
        .set('Authorization', 'Bearer valid-token')
        .set('x-version', '1.0.0');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(shipmentData);
    });
  });
});